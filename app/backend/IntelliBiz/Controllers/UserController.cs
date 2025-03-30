using IntelliBiz.Models;
using IntelliBiz.Repositories.Interfaces;
using IntelliBiz.Security.IntelliBiz.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace IntelliBiz.Controllers;

public class UserController : BaseController
{
    private readonly IUserRepository _userRepository;
    private readonly ILogger<UserController> _logger;
    private readonly IJwtTokenService _jwtTokenService;

    public UserController(IUserRepository userRepository, ILogger<UserController> logger, IJwtTokenService jwtTokenService)
    {
        _userRepository = userRepository;
        _logger = logger;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateUserRequest request)
    {
        try
        {
            var existingUser = await _userRepository.GetUserByAuth0IdAsync(request.Auth0Id);
            if (existingUser != null)
            {
                return BadRequest(new { message = "User already exists" });
            }

            var user = await _userRepository.CreateUserAsync(request);
            return CreatedAtAction(nameof(GetProfile), new { }, user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering user");
            return HandleException(ex);
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var user = await _userRepository.GetUserByEmailAsync(request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var token = _jwtTokenService.GenerateToken(user);
            return Ok(new { token });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging in");
            return HandleException(ex);
        }
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        try
        {
            var auth0Id = GetUserAuth0Id();
            var user = await _userRepository.GetUserByAuth0IdAsync(auth0Id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user profile");
            return HandleException(ex);
        }
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserRequest request)
    {
        try
        {
            var userId = GetUserId();
            var user = await _userRepository.UpdateUserAsync(userId, request);
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user profile");
            return HandleException(ex);
        }
    }

    [Authorize]
    [HttpGet("reviews")]
    public async Task<IActionResult> GetMyReviews()
    {
        try
        {
            var userId = GetUserId();
            var reviews = await _userRepository.GetUserReviewsAsync(userId);
            return Ok(reviews);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user reviews");
            return HandleException(ex);
        }
    }
}
