using Microsoft.AspNetCore.Mvc;
using IntelliBiz.Models;
using IntelliBiz.Repositories.Interfaces;

namespace IntelliBiz.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            var result = await _userRepository.CreateUserAsync(user);
            return Ok(new { Success = result > 0 });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ReadUser(int id)
        {
            var user = await _userRepository.ReadUserAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }
        [HttpGet]
        public async Task<IActionResult> ReadAllUser()
        {
            var user = await _userRepository.ReadAllUsersAsync();
            return Ok(user);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] User user)
        {
            var result = await _userRepository.UpdateUserAsync(user);
            return Ok(new { Success = result > 0 });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _userRepository.DeleteUserAsync(id);
            return Ok(new { Success = result > 0 });
        }
    }

}
