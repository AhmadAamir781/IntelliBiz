using IntelliBiz.API.Models;
using IntelliBiz.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntelliBiz.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IBusinessRepository _businessRepository;
        private readonly ILogger<AdminController> _logger;

        public AdminController(
            IUserRepository userRepository,
            IBusinessRepository businessRepository,
            ILogger<AdminController> logger)
        {
            _userRepository = userRepository;
            _businessRepository = businessRepository;
            _logger = logger;
        }

        // GET: api/admin/users
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            try
            {
                var users = await _userRepository.GetAllUsersAsync();

                // Don't return password hashes
                foreach (var user in users)
                {
                    user.PasswordHash = string.Empty;
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users");
                return StatusCode(500, "An error occurred while retrieving users");
            }
        }

        // PUT: api/admin/users/{id}/role
        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] string role)
        {
            try
            {
                var user = await _userRepository.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound($"User with ID {id} not found");
                }

                if (role != "User" && role != "BusinessOwner" && role != "Admin")
                {
                    return BadRequest("Invalid role. Role must be 'User', 'BusinessOwner', or 'Admin'");
                }

                var success = await _userRepository.UpdateUserRoleAsync(id, role);

                if (!success)
                {
                    return StatusCode(500, "Failed to update user role");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating role for user {Id}", id);
                return StatusCode(500, "An error occurred while updating the user role");
            }
        }

        // GET: api/admin/businesses
        [HttpGet("businesses")]
        public async Task<ActionResult<PagedResult<Business>>> GetBusinesses([FromQuery] BusinessQueryParameters parameters)
        {
            try
            {
                var businesses = await _businessRepository.GetBusinessesAsync(parameters);
                return Ok(businesses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving businesses");
                return StatusCode(500, "An error occurred while retrieving businesses");
            }
        }

        // GET: api/admin/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetStatistics()
        {
            try
            {
                var users = await _userRepository.GetAllUsersAsync();
                var userCount = users.Count();
                var businessOwnerCount = users.Count(u => u.Role == "BusinessOwner");

                var allBusinesses = await _businessRepository.GetBusinessesAsync(new BusinessQueryParameters { PageSize = 1000 });
                var businessCount = allBusinesses.TotalCount;
                var verifiedBusinessCount = allBusinesses.Items.Count(b => b.IsVerified);

                return Ok(new
                {
                    UserCount = userCount,
                    BusinessOwnerCount = businessOwnerCount,
                    BusinessCount = businessCount,
                    VerifiedBusinessCount = verifiedBusinessCount
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving admin statistics");
                return StatusCode(500, "An error occurred while retrieving statistics");
            }
        }
    }
}