using IntelliBiz.DTOs;
using IntelliBiz.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IntelliBiz.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController(IUserService userService) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
        {
            var users = await userService.GetAllAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetById(int id)
        {
            // Check if user is requesting their own data or is an admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userId != id && userRole != "Admin")
            {
                return Forbid();
            }

            var user = await userService.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }

        [HttpGet("role/{role}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetByRole(string role)
        {
            var users = await userService.GetByRoleAsync(role);
            return Ok(users);
        }

        [HttpGet("email/{email}")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetByEmail(string email)
        {
            var users = await userService.GetByEmailAsync(email);
            return Ok(users);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<UserDto>>> Update(int id, [FromBody] UserDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponseDto<UserDto>.ErrorResponse("Invalid user data"));
            }

            // Check if user is updating their own data or is an admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userId != id && userRole != "Admin")
            {
                return Forbid();
            }

            var response = await userService.UpdateAsync(id, userDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            var response = await userService.DeleteAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
    }
}
