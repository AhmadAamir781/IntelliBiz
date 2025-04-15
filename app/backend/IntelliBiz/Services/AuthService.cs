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

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            // Check if email already exists
            if (await _userRepository.EmailExistsAsync(registerDto.Email))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Email already exists"
                };
            }

            // Create new user
            var user = new User
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                PasswordHash = HashPassword(registerDto.Password),
                Role = registerDto.Role,
                CreatedAt = DateTime.UtcNow
            };

            // Save user to database
            int userId = await _userRepository.CreateAsync(user);
            user.Id = userId;

            // Generate JWT token
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
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);

            // Check if user exists and password is correct
            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            // Generate JWT token
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
            var expires = DateTime.Now.AddDays(7);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string HashPassword(string password)
        {
            using var hmac = new HMACSHA512();
            var salt = hmac.Key; // Randomly generated key for salt
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

            // Combine salt and hash
            var hashBytes = new byte[salt.Length + hash.Length];
            Array.Copy(salt, 0, hashBytes, 0, salt.Length);
            Array.Copy(hash, 0, hashBytes, salt.Length, hash.Length);

            return Convert.ToBase64String(hashBytes);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            var hashBytes = Convert.FromBase64String(storedHash);

            // Ensure the hashBytes length is correct (192 bytes)
            if (hashBytes.Length != 192)
            {
                throw new ArgumentException("The stored hash has an invalid length.");
            }

            // Extract salt (first 64 bytes)
            var salt = new byte[64];
            Array.Copy(hashBytes, 0, salt, 0, 64);

            // Extract the stored hash (next 128 bytes)
            var storedPasswordHash = new byte[128];
            Array.Copy(hashBytes, 64, storedPasswordHash, 0, 128);

            // Create HMAC with the extracted salt
            using var hmac = new HMACSHA512(salt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

            // Compare computed hash with the stored hash
            return computedHash.SequenceEqual(storedPasswordHash);
        }

    }
}
