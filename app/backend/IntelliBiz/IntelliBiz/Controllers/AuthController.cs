using System.Text.Json;
using Google.Apis.Auth;
using IntelliBiz.API.DTOs;
using IntelliBiz.API.Services;
using IntelliBiz.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SqlServer.Server;

namespace IntelliBiz.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;

        public AuthController(IAuthService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }

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
                var fbUser = JsonSerializer.Deserialize<FacebookUserInfo>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                // Step 2: Check if user exists
                var user = await _userService.GetByEmailAsync(fbUser.Email);

                if (user != null)
                {
                    // User exists, log them in
                    var loginResponse = await _authService.LoginWithGoogleAsync(fbUser.Email);
                    return Ok(loginResponse);
                }
                else
                {
                    // Register new user
                    var firstName = fbUser.Name?.Split(' ').FirstOrDefault() ?? "";
                    var lastName = fbUser.Name?.Split(' ').Skip(1).FirstOrDefault() ?? "";

                    var registerResponse = await _authService.RegisterWithGoogleAsync(firstName, lastName, fbUser.Email, "Customer");
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
                var user = await _userService.GetByEmailAsync(dto.Email);

                if (user != null)
                {
                    // User exists, log them in (generate JWT)
                    var loginResponse = await _authService.LoginWithGoogleAsync(dto.Email);
                    return Ok(loginResponse);
                }
                else
                {
                    // User does not exist, register them (no password required)
                    var firstName = dto.Name?.Split(' ').FirstOrDefault() ?? "";
                    var lastName = dto.Name?.Split(' ').Skip(1).FirstOrDefault() ?? "";
                    var registerResponse = await _authService.RegisterWithGoogleAsync(firstName, lastName, dto.Email, "Customer");
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

            var response = await _authService.RegisterAsync(registerDto);
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

            var response = await _authService.LoginAsync(loginDto);
            if (!response.Success)
            {
                return Unauthorized(response);
            }

            return Ok(response);
        }
    }
}
