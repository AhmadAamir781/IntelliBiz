using IntelliBiz.DTOs;
using IntelliBiz.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IntelliBiz.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController(IServiceService serviceService, IBusinessService businessService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetAll()
        {
            var services = await serviceService.GetAllAsync();
            return Ok(services);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceDto>> GetById(int id)
        {
            var service = await serviceService.GetByIdAsync(id);
            if (service == null)
            {
                return NotFound(new { message = "Service not found" });
            }

            return Ok(service);
        }

        [HttpGet("business/{businessId}")]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetByBusinessId(int businessId)
        {
            var services = await serviceService.GetByBusinessIdAsync(businessId);
            return Ok(services);
        }

        [HttpPost]
        [Authorize(Roles = "Shopkeeper,Admin")]
        public async Task<ActionResult<ApiResponseDto<ServiceDto>>> Create([FromBody] ServiceDto serviceDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponseDto<ServiceDto>.ErrorResponse("Invalid service data"));
            }

            // Verify that the user is the owner of the business or an admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var business = await businessService.GetByIdAsync(serviceDto.BusinessId);

            if (business == null)
            {
                return NotFound(ApiResponseDto<ServiceDto>.ErrorResponse("Business not found"));
            }

            if (business.OwnerId != userId && userRole != "Admin")
            {
                return Forbid();
            }

            var response = await serviceService.CreateAsync(serviceDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return CreatedAtAction(nameof(GetById), new { id = response.Data.Id }, response);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Shopkeeper,Admin")]
        public async Task<ActionResult<ApiResponseDto<ServiceDto>>> Update(int id, [FromBody] ServiceDto serviceDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponseDto<ServiceDto>.ErrorResponse("Invalid service data"));
            }

            // Verify that the user is the owner of the business or an admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var service = await serviceService.GetByIdAsync(id);

            if (service == null)
            {
                return NotFound(ApiResponseDto<ServiceDto>.ErrorResponse("Service not found"));
            }

            var business = await businessService.GetByIdAsync(service.BusinessId);
            if (business == null)
            {
                return NotFound(ApiResponseDto<ServiceDto>.ErrorResponse("Business not found"));
            }

            if (business.OwnerId != userId && userRole != "Admin")
            {
                return Forbid();
            }

            var response = await serviceService.UpdateAsync(id, serviceDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Shopkeeper,Admin")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            // Verify that the user is the owner of the business or an admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var service = await serviceService.GetByIdAsync(id);

            if (service == null)
            {
                return NotFound(ApiResponseDto<bool>.ErrorResponse("Service not found"));
            }

            var business = await businessService.GetByIdAsync(service.BusinessId);
            if (business == null)
            {
                return NotFound(ApiResponseDto<bool>.ErrorResponse("Business not found"));
            }

            if (business.OwnerId != userId && userRole != "Admin")
            {
                return Forbid();
            }

            var response = await serviceService.DeleteAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpPatch("{id}/toggle-active")]
        [Authorize(Roles = "Shopkeeper,Admin")]
        public async Task<ActionResult<ApiResponseDto<bool>>> ToggleActive(int id)
        {
            // Verify that the user is the owner of the business or an admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var service = await serviceService.GetByIdAsync(id);

            if (service == null)
            {
                return NotFound(ApiResponseDto<bool>.ErrorResponse("Service not found"));
            }

            var business = await businessService.GetByIdAsync(service.BusinessId);
            if (business == null)
            {
                return NotFound(ApiResponseDto<bool>.ErrorResponse("Business not found"));
            }

            if (business.OwnerId != userId && userRole != "Admin")
            {
                return Forbid();
            }

            var response = await serviceService.ToggleActiveStatusAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
    }
}
