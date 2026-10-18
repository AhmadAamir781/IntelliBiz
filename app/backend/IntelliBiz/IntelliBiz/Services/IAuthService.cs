using IntelliBiz.DTOs;

namespace IntelliBiz.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        string GenerateJwtToken(UserDto user);
        Task<AuthResponseDto> LoginWithGoogleAsync(string email);
        Task<AuthResponseDto> RegisterWithGoogleAsync(string firstName, string lastName, string email, string role = "Customer");
        Task<AuthResponseDto> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);
        Task<AuthResponseDto> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
    }
}
