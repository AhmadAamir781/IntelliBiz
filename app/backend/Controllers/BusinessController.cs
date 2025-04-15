using Microsoft.AspNetCore.Mvc;
using IntelliBiz.API.Models;
using IntelliBiz.API.Repositories;

namespace IntelliBiz.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BusinessController : ControllerBase
{
    private readonly IBusinessRepository _businessRepository;
    private readonly ILogger<BusinessController> _logger;

    public BusinessController(IBusinessRepository businessRepository, ILogger<BusinessController> logger)
    {
        _businessRepository = businessRepository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Business>>> GetBusinesses([FromQuery] BusinessSearchRequest? searchRequest)
    {
        try
        {
            var businesses = await _businessRepository.GetAllAsync(searchRequest);
            return Ok(businesses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting businesses");
            return StatusCode(500, "An error occurred while retrieving businesses");
        }
    }

    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<Business>>> GetFeaturedBusinesses([FromQuery] int count = 6)
    {
        try
        {
            var businesses = await _businessRepository.GetFeaturedBusinessesAsync(count);
            return Ok(businesses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting featured businesses");
            return StatusCode(500, "An error occurred while retrieving featured businesses");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Business>> GetBusiness(int id)
    {
        try
        {
            var business = await _businessRepository.GetByIdAsync(id);
            if (business == null)
            {
                return NotFound($"Business with ID {id} not found");
            }
            return Ok(business);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting business {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the business");
        }
    }

    [HttpPost]
    public async Task<ActionResult<int>> CreateBusiness(CreateBusinessRequest business)
    {
        try
        {
            var id = await _businessRepository.CreateAsync(business);
            return CreatedAtAction(nameof(GetBusiness), new { id }, id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating business");
            return StatusCode(500, "An error occurred while creating the business");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBusiness(int id, UpdateBusinessRequest business)
    {
        try
        {
            var success = await _businessRepository.UpdateAsync(id, business);
            if (!success)
            {
                return NotFound($"Business with ID {id} not found");
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating business {Id}", id);
            return StatusCode(500, "An error occurred while updating the business");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBusiness(int id)
    {
        try
        {
            var success = await _businessRepository.DeleteAsync(id);
            if (!success)
            {
                return NotFound($"Business with ID {id} not found");
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting business {Id}", id);
            return StatusCode(500, "An error occurred while deleting the business");
        }
    }
} 