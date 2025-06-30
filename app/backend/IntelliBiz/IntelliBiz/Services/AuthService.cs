using IntelliBiz.API.DTOs;
using IntelliBiz.API.Models;
using IntelliBiz.API.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace IntelliBiz.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IPasswordResetTokenRepository _passwordResetTokenRepository;
        private readonly IEmailService _emailService;

        public AuthService(IUserRepository userRepository, IConfiguration configuration, IPasswordResetTokenRepository passwordResetTokenRepository, IEmailService emailService)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _passwordResetTokenRepository = passwordResetTokenRepository;
            _emailService = emailService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            if (await _userRepository.EmailExistsAsync(registerDto.Email))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Email already exists"
                };
            }

            var user = new User
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                PasswordHash = HashPassword(registerDto.Password),
                Role = registerDto.Role,
                CreatedAt = DateTime.UtcNow
            };

            var users = await _userRepository.GetAllAsync();
            if(users.Count() == 0)
            {
                user.Role = "Admin";
            }

            int userId = await _userRepository.CreateAsync(user);
            user.Id = userId;

            var userDto = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };

            string token = GenerateJwtToken(userDto);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Registration successful",
                Token = token,
                User = userDto
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);

            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };

            string token = GenerateJwtToken(userDto);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                User = userDto
            };
        }

        public string GenerateJwtToken(UserDto user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddDays(7);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Use PBKDF2 instead of HMACSHA256 for better security
        public static string HashPassword(string password)
        {
            using var rng = RandomNumberGenerator.Create();
            byte[] salt = new byte[16];
            rng.GetBytes(salt);

            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100000, HashAlgorithmName.SHA256);
            byte[] hash = pbkdf2.GetBytes(32); // 256-bit hash

            byte[] hashBytes = new byte[48]; // 16 bytes salt + 32 bytes hash
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 32);

            return Convert.ToBase64String(hashBytes);
        }

        public static bool VerifyPassword(string password, string storedHash)
        {
            byte[] hashBytes = Convert.FromBase64String(storedHash);

            if (hashBytes.Length != 48)
                return false;

            byte[] salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);

            byte[] storedPasswordHash = new byte[32];
            Array.Copy(hashBytes, 16, storedPasswordHash, 0, 32);

            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100000, HashAlgorithmName.SHA256);
            byte[] computedHash = pbkdf2.GetBytes(32);

            return AreHashesEqual(computedHash, storedPasswordHash);
        }

        private static bool AreHashesEqual(byte[] hash1, byte[] hash2)
        {
            if (hash1.Length != hash2.Length) return false;

            var result = 0;
            for (int i = 0; i < hash1.Length; i++)
            {
                result |= hash1[i] ^ hash2[i];
            }

            return result == 0;
        }

        public async Task<AuthResponseDto> LoginWithGoogleAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "User not found"
                };
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };

            string token = GenerateJwtToken(userDto);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                User = userDto
            };
        }

        public async Task<AuthResponseDto> RegisterWithGoogleAsync(string firstName, string lastName, string email, string role = "Customer")
        {
            if (await _userRepository.EmailExistsAsync(email))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Email already exists"
                };
            }

            var user = new User
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                PasswordHash = string.Empty, // No password for Google accounts
                Role = role,
                CreatedAt = DateTime.UtcNow
            };

            var users = await _userRepository.GetAllAsync();
            if(users.Count() == 0)
            {
                user.Role = "Admin";
            }

            int userId = await _userRepository.CreateAsync(user);
            user.Id = userId;

            var userDto = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };

            string token = GenerateJwtToken(userDto);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Registration successful",
                Token = token,
                User = userDto
            };
        }

        public async Task<AuthResponseDto> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _userRepository.GetByEmailAsync(forgotPasswordDto.Email);
            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "No user found with this email address."
                };
            }

            // Generate a secure token
            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            var expiration = DateTime.UtcNow.AddHours(1);
            var resetToken = new PasswordResetToken
            {
                UserId = user.Id,
                Token = token,
                Expiration = expiration,
                User = user
            };
            await _passwordResetTokenRepository.AddAsync(resetToken);

            // Compose reset link (replace with your frontend URL)
            var resetLink = $"http://localhost:3000/reset-password?token={Uri.EscapeDataString(token)}";
            var subject = "Password Reset Request";
            var body = $"Click the following link to reset your password: {resetLink}\nThis link will expire in 1 hour.";
            await _emailService.SendEmailAsync(user.Email, subject, body);

            return new AuthResponseDto
            {
                Success = true,
                Message = "If an account with that email exists, a password reset link has been sent."
            };
        }

        public async Task<AuthResponseDto> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            // Get token
            var tokenEntry = await _passwordResetTokenRepository.GetByTokenAsync(resetPasswordDto.Token);
            if (tokenEntry == null || tokenEntry.Expiration < DateTime.UtcNow)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid or expired token."
                };
            }

            // Get user
            var user = await _userRepository.GetByEmailAsync(tokenEntry.User.Email);
            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "User not found."
                };
            }

            // Update password
            user.PasswordHash = HashPassword(resetPasswordDto.NewPassword);
            await _userRepository.UpdateAsync(user);

            // Delete token
            await _passwordResetTokenRepository.DeleteExpiredAsync();

            return new AuthResponseDto
            {
                Success = true,
                Message = "Password has been reset successfully."
            };
        }
    }
}
