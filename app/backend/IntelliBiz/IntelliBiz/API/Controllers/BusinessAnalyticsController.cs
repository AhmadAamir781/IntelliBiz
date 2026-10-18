using IntelliBiz.API.Services;
using IntelliBiz.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntelliBiz.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BusinessAnalyticsController(IBusinessAnalyticsService analyticsService) : ControllerBase
    {
        [HttpGet("{businessId}")]
        public async Task<ActionResult<BusinessAnalyticsDto>> GetAnalytics(int businessId, [FromQuery] string timeRange = "30days")
        {
            // Validate timeRange
            if (!IsValidTimeRange(timeRange))
            {
                return BadRequest(new { message = "Invalid time range. Valid values are: 7days, 30days, 90days, year" });
            }

            var analytics = await analyticsService.GetBusinessAnalyticsAsync(businessId, timeRange);
            return Ok(analytics);
        }

        private static bool IsValidTimeRange(string timeRange)
        {
            return timeRange switch
            {
                "7days" or "30days" or "90days" or "year" => true,
                _ => false
            };
        }
    }
}