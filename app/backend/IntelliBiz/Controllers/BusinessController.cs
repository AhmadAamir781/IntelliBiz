using IntelliBiz.Models;
using IntelliBiz.Repositories;
using IntelliBiz.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class BusinessController(IBusinessRepository businessRepository) : ControllerBase
{
    // Create Business
    [HttpPost]
    public async Task<IActionResult> CreateBusiness([FromBody] Business business)
    {
        if (business == null)
        {
            return BadRequest("Business data is required.");
        }

        var result = await businessRepository.CreateBusinessAsync(business);
        if (result > 0)
        {
            return Ok("Business created successfully.");
        }

        return StatusCode(500, "Error creating business.");
    }

    // Update Business
    [HttpPut]
    public async Task<IActionResult> UpdateBusiness([FromBody] Business business)
    {
        if (business == null)
        {
            return BadRequest("Business data is required.");
        }

        var result = await businessRepository.UpdateBusinessAsync(business);
        if (result > 0)
        {
            return Ok("Business updated successfully.");
        }

        return StatusCode(500, "Error updating business.");
    }

    // Delete Business
    [HttpDelete("{businessId}")]
    public async Task<IActionResult> DeleteBusiness(int businessId)
    {
        var result = await businessRepository.DeleteBusinessAsync(businessId);
        if (result > 0)
        {
            return Ok("Business deleted successfully.");
        }

        return StatusCode(500, "Error deleting business.");
    }

    // Get Single Business
    [HttpGet("{businessId}")]
    public async Task<IActionResult> GetBusiness(int businessId)
    {
        var business = await businessRepository.ReadBusinessAsync(businessId);
        if (business != null)
        {
            return Ok(business);
        }

        return NotFound("Business not found.");
    }

    // Get All Businesses
    [HttpGet]
    public async Task<IActionResult> GetAllBusinesses()
    {
        var businesses = await businessRepository.GetAllBusinessesAsync();
        return Ok(businesses);
    }
}
