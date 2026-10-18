using Google.Apis.Auth;
using IntelliBiz.DTOs;
using IntelliBiz.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace IntelliBiz.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService, IUserService userService) : ControllerBase
    {
        [HttpPost("facebook")]
        public async Task<IActionResult> FacebookLogin([FromBody] FacebookLoginRequest dto)
        {
            try
            {
                // Step 1: Validate the Facebook token and get user info
                using var httpClient = new HttpClient();
                var url = $"https://graph.facebook.com/me?fields=id,name,email,picture&access_token={dto.AccessToken}";

                var response = await httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                    return BadRequest(new { Message = "Invalid Facebook token" });

                var content = await response.Content.ReadAsStringAsync();
                JsonSerializerOptions jsonSerializerOptions = new()
                {
                    PropertyNameCaseInsensitive = true
                };
                JsonSerializerOptions options = jsonSerializerOptions;
                var fbUser = JsonSerializer.Deserialize<FacebookUserInfo>(content, options);

                // Step 2: Check if user exists
                var user = await userService.GetByEmailAsync(fbUser.Email);

                if (user != null)
                {
                    // User exists, log them in
                    var loginResponse = await authService.LoginWithGoogleAsync(fbUser.Email);
                    return Ok(loginResponse);
                }
                else
                {
                    // Register new user
                    var firstName = fbUser.Name?.Split(' ').FirstOrDefault() ?? "";
                    var lastName = fbUser.Name?.Split(' ').Skip(1).FirstOrDefault() ?? "";

                    var registerResponse = await authService.RegisterWithGoogleAsync(firstName, lastName, fbUser.Email, "Customer");
                    return Ok(registerResponse);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Facebook login failed", Details = ex.Message });
            }
        }


        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleUserInfo dto)
        {
            try
            {
                // 1. Validate Google token here if needed (omitted for brevity)

                // 2. Check if user exists
                var user = await userService.GetByEmailAsync(dto.Email);

                if (user != null)
                {
                    // User exists, log them in (generate JWT)
                    var loginResponse = await authService.LoginWithGoogleAsync(dto.Email);
                    return Ok(loginResponse);
                }
                else
                {
                    // User does not exist, register them (no password required)
                    var firstName = dto.Name?.Split(' ').FirstOrDefault() ?? "";
                    var lastName = dto.Name?.Split(' ').Skip(1).FirstOrDefault() ?? "";
                    var registerResponse = await authService.RegisterWithGoogleAsync(firstName, lastName, dto.Email, "Customer");
                    return Ok(registerResponse);
                }
            }
            catch (InvalidJwtException)
            {
                return BadRequest(new { Message = "Invalid Google token" });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid registration data"
                });
            }

            var response = await authService.RegisterAsync(registerDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid login data"
                });
            }

            var response = await authService.LoginAsync(loginDto);
            if (!response.Success)
            {
                return Unauthorized(response);
            }

            return Ok(response);
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult<AuthResponseDto>> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid request data"
                });
            }

            var response = await authService.ForgotPasswordAsync(forgotPasswordDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<AuthResponseDto>> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid request data"
                });
            }

            var response = await authService.ResetPasswordAsync(resetPasswordDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
    }
}
