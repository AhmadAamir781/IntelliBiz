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
    public class BusinessAnalyticsController : ControllerBase
    {
        private readonly IBusinessAnalyticsService _analyticsService;

        public BusinessAnalyticsController(IBusinessAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        [HttpGet("{businessId}")]
        public async Task<ActionResult<BusinessAnalyticsDto>> GetAnalytics(int businessId, [FromQuery] string timeRange = "30days")
        {
            // Validate timeRange
            if (!IsValidTimeRange(timeRange))
            {
                return BadRequest(new { message = "Invalid time range. Valid values are: 7days, 30days, 90days, year" });
            }

            var analytics = await _analyticsService.GetBusinessAnalyticsAsync(businessId, timeRange);
            return Ok(analytics);
        }

        private bool IsValidTimeRange(string timeRange)
        {
            return timeRange switch
            {
                "7days" or "30days" or "90days" or "year" => true,
                _ => false
            };
        }
    }
} 