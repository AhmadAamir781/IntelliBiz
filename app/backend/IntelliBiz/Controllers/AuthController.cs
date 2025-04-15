using IntelliBiz.API.Models;
using IntelliBiz.Repositories;
using IntelliBiz.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace IntelliBiz.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IUserRepository userRepository,
            ITokenService tokenService,
            ILogger<AuthController> logger)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(UserRegister request)
        {
            try
            {
                // Check if email already exists
                var existingUser = await _userRepository.GetUserByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    return BadRequest("Email is already registered");
                }

                // Check if username already exists
                var existingUsername = await _userRepository.GetUserByUsernameAsync(request.Username);
                if (existingUsername != null)
                {
                    return BadRequest("Username is already taken");
                }

                // Create password hash
                using var hmac = new HMACSHA512();
                var passwordHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(request.Password)));
                var passwordSalt = Convert.ToBase64String(hmac.Key);

                // Create new user
                var user = new User
                {
                    Username = request.Username,
                    Email = request.Email,
                    PasswordHash = passwordHash + ":" + passwordSalt, // Store both hash and salt
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    PhoneNumber = request.PhoneNumber,
                    Role = "User", // Default role
                    CreatedAt = DateTime.UtcNow
                };

                var userId = await _userRepository.CreateUserAsync(user);
                user.Id = userId;

                // Generate token
                var token = _tokenService.CreateToken(user);

                // Return user info and token
                return Ok(new AuthResponse
                {
                    UserId = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role,
                    Token = token
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration");
                return StatusCode(500, "An error occurred during registration");
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(UserLogin request)
        {
            try
            {
                // Find user by email
                var user = await _userRepository.GetUserByEmailAsync(request.Email);
                if (user == null)
                {
                    return Unauthorized("Invalid email or password");
                }

                // Verify password
                var passwordParts = user.PasswordHash.Split(':');
                if (passwordParts.Length != 2)
                {
                    return StatusCode(500, "Invalid password format in database");
                }

                var storedHash = passwordParts[0];
                var storedSalt = passwordParts[1];

                using var hmac = new HMACSHA512(Convert.FromBase64String(storedSalt));
                var computedHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(request.Password)));

                if (computedHash != storedHash)
                {
                    return Unauthorized("Invalid email or password");
                }

                // Generate token
                var token = _tokenService.CreateToken(user);

                // Return user info and token
                return Ok(new AuthResponse
                {
                    UserId = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role,
                    Token = token
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user login");
                return StatusCode(500, "An error occurred during login");
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<User>> GetCurrentUser()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var user = await _userRepository.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                // Don't return the password hash
                user.PasswordHash = string.Empty;

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving current user");
                return StatusCode(500, "An error occurred while retrieving user information");
            }
        }

        [HttpPut("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePassword request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var user = await _userRepository.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                // Verify current password
                var passwordParts = user.PasswordHash.Split(':');
                if (passwordParts.Length != 2)
                {
                    return StatusCode(500, "Invalid password format in database");
                }

                var storedHash = passwordParts[0];
                var storedSalt = passwordParts[1];

                using var hmac = new HMACSHA512(Convert.FromBase64String(storedSalt));
                var computedHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(request.CurrentPassword)));

                if (computedHash != storedHash)
                {
                    return BadRequest("Current password is incorrect");
                }

                // Create new password hash
                using var newHmac = new HMACSHA512();
                var newPasswordHash = Convert.ToBase64String(newHmac.ComputeHash(Encoding.UTF8.GetBytes(request.NewPassword)));
                var newPasswordSalt = Convert.ToBase64String(newHmac.Key);

                // Update password
                var success = await _userRepository.ChangePasswordAsync(userId, newPasswordHash + ":" + newPasswordSalt);
                if (!success)
                {
                    return StatusCode(500, "Failed to update password");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password");
                return StatusCode(500, "An error occurred while changing password");
            }
        }

        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile(UserUpdate request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var user = await _userRepository.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                // Check if email is being changed and if it's already in use
                if (user.Email != request.Email)
                {
                    var existingUser = await _userRepository.GetUserByEmailAsync(request.Email);
                    if (existingUser != null && existingUser.Id != userId)
                    {
                        return BadRequest("Email is already in use");
                    }
                }

                // Check if username is being changed and if it's already in use
                if (user.Username != request.Username)
                {
                    var existingUser = await _userRepository.GetUserByUsernameAsync(request.Username);
                    if (existingUser != null && existingUser.Id != userId)
                    {
                        return BadRequest("Username is already taken");
                    }
                }

                // Update user
                user.Username = request.Username;
                user.Email = request.Email;
                user.FirstName = request.FirstName;
                user.LastName = request.LastName;
                user.PhoneNumber = request.PhoneNumber;
                user.UpdatedAt = DateTime.UtcNow;

                var success = await _userRepository.UpdateUserAsync(user);
                if (!success)
                {
                    return StatusCode(500, "Failed to update profile");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user profile");
                return StatusCode(500, "An error occurred while updating profile");
            }
        }
    }
}