using IntelliBiz.API.Models;
using IntelliBiz.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IntelliBiz.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BusinessesController : ControllerBase
    {
        private readonly IBusinessRepository _businessRepository;
        private readonly ILogger<BusinessesController> _logger;

        public BusinessesController(
            IBusinessRepository businessRepository,
            ILogger<BusinessesController> logger)
        {
            _businessRepository = businessRepository;
            _logger = logger;
        }

        // GET: api/businesses
        [HttpGet]
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

        // GET: api/businesses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Business>> GetBusiness(int id)
        {
            try
            {
                var business = await _businessRepository.GetBusinessByIdAsync(id);

                if (business == null)
                {
                    return NotFound($"Business with ID {id} not found");
                }

                return Ok(business);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving business with ID {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the business");
            }
        }

        // GET: api/businesses/owner
        [HttpGet("owner")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Business>>> GetBusinessesByOwner()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int ownerId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var businesses = await _businessRepository.GetBusinessesByOwnerIdAsync(ownerId);
                return Ok(businesses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving businesses for owner");
                return StatusCode(500, "An error occurred while retrieving businesses");
            }
        }

        // POST: api/businesses
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Business>> CreateBusiness(Business business)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int ownerId))
                {
                    return BadRequest("Invalid user ID format");
                }

                business.OwnerId = ownerId;
                business.CreatedAt = DateTime.UtcNow;
                business.IsVerified = false; // New businesses are not verified by default

                var id = await _businessRepository.CreateBusinessAsync(business);
                business.Id = id;

                // Create business hours for each day of the week
                if (business.BusinessHours != null && business.BusinessHours.Any())
                {
                    foreach (var hour in business.BusinessHours)
                    {
                        hour.BusinessId = id;
                        await _businessRepository.CreateBusinessHourAsync(hour);
                    }
                }

                // Add business images
                if (business.Images != null && business.Images.Any())
                {
                    foreach (var imageUrl in business.Images)
                    {
                        await _businessRepository.AddBusinessImageAsync(id, imageUrl);
                    }
                }

                return CreatedAtAction(nameof(GetBusiness), new { id }, business);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating business");
                return StatusCode(500, "An error occurred while creating the business");
            }
        }

        // PUT: api/businesses/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateBusiness(int id, Business business)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int ownerId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var existingBusiness = await _businessRepository.GetBusinessByIdAsync(id);
                if (existingBusiness == null)
                {
                    return NotFound($"Business with ID {id} not found");
                }

                // Check if user is the owner or an admin
                if (existingBusiness.OwnerId != ownerId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to update this business");
                }

                business.Id = id;
                business.OwnerId = existingBusiness.OwnerId; // Preserve original owner
                business.IsVerified = existingBusiness.IsVerified; // Preserve verification status

                var success = await _businessRepository.UpdateBusinessAsync(business);

                if (!success)
                {
                    return StatusCode(500, "Failed to update business");
                }

                // Update business hours
                if (business.BusinessHours != null && business.BusinessHours.Any())
                {
                    // Delete existing hours
                    await _businessRepository.DeleteBusinessHoursAsync(id);

                    // Add new hours
                    foreach (var hour in business.BusinessHours)
                    {
                        hour.BusinessId = id;
                        await _businessRepository.CreateBusinessHourAsync(hour);
                    }
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating business with ID {Id}", id);
                return StatusCode(500, "An error occurred while updating the business");
            }
        }

        // DELETE: api/businesses/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteBusiness(int id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int ownerId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var existingBusiness = await _businessRepository.GetBusinessByIdAsync(id);
                if (existingBusiness == null)
                {
                    return NotFound($"Business with ID {id} not found");
                }

                // Check if user is the owner or an admin
                if (existingBusiness.OwnerId != ownerId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to delete this business");
                }

                var success = await _businessRepository.DeleteBusinessAsync(id);

                if (!success)
                {
                    return StatusCode(500, "Failed to delete business");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting business with ID {Id}", id);
                return StatusCode(500, "An error occurred while deleting the business");
            }
        }

        // GET: api/businesses/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            try
            {
                var categories = await _businessRepository.GetCategoriesAsync();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving categories");
                return StatusCode(500, "An error occurred while retrieving categories");
            }
        }

        // GET: api/businesses/cities
        [HttpGet("cities")]
        public async Task<ActionResult<IEnumerable<string>>> GetCities()
        {
            try
            {
                var cities = await _businessRepository.GetCitiesAsync();
                return Ok(cities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving cities");
                return StatusCode(500, "An error occurred while retrieving cities");
            }
        }

        // GET: api/businesses/states
        [HttpGet("states")]
        public async Task<ActionResult<IEnumerable<string>>> GetStates()
        {
            try
            {
                var states = await _businessRepository.GetStatesAsync();
                return Ok(states);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving states");
                return StatusCode(500, "An error occurred while retrieving states");
            }
        }

        // POST: api/businesses/{id}/verify
        [HttpPost("{id}/verify")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> VerifyBusiness(int id, [FromBody] bool isVerified)
        {
            try
            {
                var business = await _businessRepository.GetBusinessByIdAsync(id);
                if (business == null)
                {
                    return NotFound($"Business with ID {id} not found");
                }

                var success = await _businessRepository.VerifyBusinessAsync(id, isVerified);

                if (!success)
                {
                    return StatusCode(500, "Failed to update business verification status");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying business with ID {Id}", id);
                return StatusCode(500, "An error occurred while verifying the business");
            }
        }
    }
}