using IntelliBiz.API.DTOs;
using IntelliBiz.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IntelliBiz.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BusinessesController : ControllerBase
    {
        private readonly IBusinessService _businessService;

        public BusinessesController(IBusinessService businessService)
        {
            _businessService = businessService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BusinessDto>>> GetAll()
        {
            var businesses = await _businessService.GetAllAsync();
            return Ok(businesses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BusinessDto>> GetById(int id)
        {
            var business = await _businessService.GetByIdAsync(id);
            if (business == null)
            {
                return NotFound(new { message = "Business not found" });
            }

            return Ok(business);
        }

        [HttpGet("owner/{ownerId}")]
        public async Task<ActionResult<IEnumerable<BusinessDto>>> GetByOwnerId(int ownerId)
        {
            var businesses = await _businessService.GetByOwnerIdAsync(ownerId);
            return Ok(businesses);
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<BusinessDto>>> GetByCategory(string category)
        {
            var businesses = await _businessService.GetByCategoryAsync(category);
            return Ok(businesses);
        }
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            var categories = await _businessService.GetCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<BusinessDto>>> Search([FromQuery] string term, [FromQuery] string? category = null)
        {
            var businesses = await _businessService.SearchAsync(term, category);
            return Ok(businesses);
        }

        [HttpPost]
        //[Authorize(Roles = "Shopkeeper,Admin")]
        public async Task<ActionResult<ApiResponseDto<BusinessDto>>> Create([FromBody] BusinessDto businessDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponseDto<BusinessDto>.ErrorResponse("Invalid business data"));
            }

            // Set owner ID from the authenticated user if not provided
            if (businessDto.OwnerId == 0)
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                businessDto.OwnerId = userId;
            }

            var response = await _businessService.CreateAsync(businessDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return CreatedAtAction(nameof(GetById), new { id = response.Data.Id }, response);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponseDto<BusinessDto>>> Update(int id, [FromBody] BusinessDto businessDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponseDto<BusinessDto>.ErrorResponse("Invalid business data"));
            }

            // Check if user is the owner of the business or an admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var business = await _businessService.GetByIdAsync(id);

            if (business == null)
            {
                return NotFound(ApiResponseDto<BusinessDto>.ErrorResponse("Business not found"));
            }

            if (business.OwnerId != userId && userRole != "Admin")
            {
                return Forbid();
            }

            var response = await _businessService.UpdateAsync(id, businessDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            // Check if user is the owner of the business or an admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var business = await _businessService.GetByIdAsync(id);

            if (business == null)
            {
                return NotFound(ApiResponseDto<bool>.ErrorResponse("Business not found"));
            }

            if (business.OwnerId != userId && userRole != "Admin")
            {
                return Forbid();
            }

            var response = await _businessService.DeleteAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpPatch("{id}/verify")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponseDto<bool>>> VerifyBusiness(int id)
        {
            var response = await _businessService.VerifyBusinessAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
    }
}
