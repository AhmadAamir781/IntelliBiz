using IntelliBiz.API.Services;
using IntelliBiz.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntelliBiz.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BusinessDetailController(IBusinessDetailService businessDetailService) : ControllerBase
    {
        [HttpGet("{businessId}")]
        public async Task<ActionResult<BusinessDetailDto?>> GetBusinessDetail(int businessId)
        {
            var businessDetail = await businessDetailService.GetBusinessDetailAsync(businessId);
            if (businessDetail == null)
            {
                return NotFound(new { message = "Business not found" });
            }

            return Ok(businessDetail);
        }
    }
}