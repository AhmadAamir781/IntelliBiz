using IntelliBiz.API.DTOs;

namespace IntelliBiz.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        string GenerateJwtToken(UserDto user);
        Task<AuthResponseDto> LoginWithGoogleAsync(string email);
        Task<AuthResponseDto> RegisterWithGoogleAsync(string firstName, string lastName, string email, string role = "Customer");
    }
}
