using IntelliBiz.API.Models;
using IntelliBiz.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IntelliBiz.Controllers
{
    [ApiController]
    [Route("api/businesses/{businessId}/services")]
    public class BusinessServicesController : ControllerBase
    {
        private readonly IBusinessRepository _businessRepository;
        private readonly ILogger<BusinessServicesController> _logger;

        public BusinessServicesController(
            IBusinessRepository businessRepository,
            ILogger<BusinessServicesController> logger)
        {
            _businessRepository = businessRepository;
            _logger = logger;
        }

        // GET: api/businesses/{businessId}/services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BusinessService>>> GetServices(int businessId)
        {
            try
            {
                var business = await _businessRepository.GetBusinessByIdAsync(businessId);
                if (business == null)
                {
                    return NotFound($"Business with ID {businessId} not found");
                }

                var services = await _businessRepository.GetBusinessServicesAsync(businessId);
                return Ok(services);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving services for business {BusinessId}", businessId);
                return StatusCode(500, "An error occurred while retrieving services");
            }
        }

        // GET: api/businesses/{businessId}/services/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BusinessService>> GetService(int businessId, int id)
        {
            try
            {
                var service = await _businessRepository.GetBusinessServiceByIdAsync(id);

                if (service == null)
                {
                    return NotFound($"Service with ID {id} not found");
                }

                if (service.BusinessId != businessId)
                {
                    return BadRequest("Service does not belong to the specified business");
                }

                return Ok(service);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving service {Id} for business {BusinessId}", id, businessId);
                return StatusCode(500, "An error occurred while retrieving the service");
            }
        }

        // POST: api/businesses/{businessId}/services
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<BusinessService>> CreateService(int businessId, BusinessService service)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var business = await _businessRepository.GetBusinessByIdAsync(businessId);
                if (business == null)
                {
                    return NotFound($"Business with ID {businessId} not found");
                }

                // Check if user is the owner or an admin
                if (business.OwnerId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to add services to this business");
                }

                service.BusinessId = businessId;

                var id = await _businessRepository.CreateBusinessServiceAsync(service);
                service.Id = id;

                return CreatedAtAction(nameof(GetService), new { businessId, id }, service);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating service for business {BusinessId}", businessId);
                return StatusCode(500, "An error occurred while creating the service");
            }
        }

        // PUT: api/businesses/{businessId}/services/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateService(int businessId, int id, BusinessService service)
        {
            try
            {
                if (id != service.Id)
                {
                    return BadRequest("ID in URL does not match ID in request body");
                }

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var business = await _businessRepository.GetBusinessByIdAsync(businessId);
                if (business == null)
                {
                    return NotFound($"Business with ID {businessId} not found");
                }

                // Check if user is the owner or an admin
                if (business.OwnerId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to update services for this business");
                }

                var existingService = await _businessRepository.GetBusinessServiceByIdAsync(id);
                if (existingService == null)
                {
                    return NotFound($"Service with ID {id} not found");
                }

                if (existingService.BusinessId != businessId)
                {
                    return BadRequest("Service does not belong to the specified business");
                }

                service.BusinessId = businessId;

                var success = await _businessRepository.UpdateBusinessServiceAsync(service);

                if (!success)
                {
                    return StatusCode(500, "Failed to update service");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating service {Id} for business {BusinessId}", id, businessId);
                return StatusCode(500, "An error occurred while updating the service");
            }
        }

        // DELETE: api/businesses/{businessId}/services/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteService(int businessId, int id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var business = await _businessRepository.GetBusinessByIdAsync(businessId);
                if (business == null)
                {
                    return NotFound($"Business with ID {businessId} not found");
                }

                // Check if user is the owner or an admin
                if (business.OwnerId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to delete services for this business");
                }

                var existingService = await _businessRepository.GetBusinessServiceByIdAsync(id);
                if (existingService == null)
                {
                    return NotFound($"Service with ID {id} not found");
                }

                if (existingService.BusinessId != businessId)
                {
                    return BadRequest("Service does not belong to the specified business");
                }

                var success = await _businessRepository.DeleteBusinessServiceAsync(id);

                if (!success)
                {
                    return StatusCode(500, "Failed to delete service");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting service {Id} for business {BusinessId}", id, businessId);
                return StatusCode(500, "An error occurred while deleting the service");
            }
        }
    }
}