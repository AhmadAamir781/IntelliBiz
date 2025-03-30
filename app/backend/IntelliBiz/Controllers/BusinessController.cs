
using IntelliBiz.Models;
using IntelliBiz.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntelliBiz.Controllers;

public class BusinessController : BaseController
{
    private readonly IBusinessRepository _businessRepository;
    private readonly ILogger<BusinessController> _logger;

    public BusinessController(IBusinessRepository businessRepository, ILogger<BusinessController> logger)
    {
        _businessRepository = businessRepository;
        _logger = logger;
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedBusinesses([FromQuery] int count = 6)
    {
        try
        {
            var businesses = await _businessRepository.GetFeaturedBusinessesAsync(count);
            return Ok(businesses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting featured businesses");
            return HandleException(ex);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBusinessDetails(int id)
    {
        try
        {
            var business = await _businessRepository.GetBusinessDetailsAsync(id);
            if (business == null)
            {
                return NotFound(new { message = "Business not found" });
            }

            return Ok(business);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting business details");
            return HandleException(ex);
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateBusiness([FromBody] CreateBusinessRequest request)
    {
        try
        {
            var userId = 1;
            var business = await _businessRepository.CreateBusinessAsync(request, userId);
            return CreatedAtAction(nameof(GetBusinessDetails), new { id = business.BusinessId }, business);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating business");
            return HandleException(ex);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBusiness(int id, [FromBody] UpdateBusinessRequest request)
    {
        try
        {
            var business = await _businessRepository.UpdateBusinessAsync(id, request);
            return Ok(business);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating business");
            return HandleException(ex);
        }
    }

    [HttpPost("{id}/images")]
    public async Task<IActionResult> AddBusinessImage(int id, [FromBody] BusinessImageRequest request)
    {
        try
        {
            var image = await _businessRepository.AddBusinessImageAsync(id, request);
            return Ok(image);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding business image");
            return HandleException(ex);
        }
    }

    [HttpPost("{id}/reviews")]
    public async Task<IActionResult> AddBusinessReview(int id, [FromBody] CreateReviewRequest request)
    {
        try
        {
            var userId = GetUserId();
            var review = await _businessRepository.AddBusinessReviewAsync(id, userId, request);
            return Ok(review);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding business review");
            return HandleException(ex);
        }
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyBusinesses()
    {
        try
        {
            var userId = GetUserId();
            var businesses = await _businessRepository.GetUserBusinessesAsync(userId);
            return Ok(businesses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user businesses");
            return HandleException(ex);
        }
    }
} 