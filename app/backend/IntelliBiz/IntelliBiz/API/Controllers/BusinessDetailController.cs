using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using IntelliBiz.API.DTOs;
using IntelliBiz.API.Services;
using IntelliBiz.DTOs;

namespace IntelliBiz.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BusinessDetailController : ControllerBase
    {
        private readonly IBusinessDetailService _businessDetailService;

        public BusinessDetailController(IBusinessDetailService businessDetailService)
        {
            _businessDetailService = businessDetailService;
        }

        [HttpGet("{businessId}")]
        public async Task<ActionResult<BusinessDetailDto>> GetBusinessDetail(int businessId)
        {
            var businessDetail = await _businessDetailService.GetBusinessDetailAsync(businessId);
            if (businessDetail == null)
            {
                return NotFound(new { message = "Business not found" });
            }

            return Ok(businessDetail);
        }
    }
} 