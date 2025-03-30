using Microsoft.AspNetCore.Mvc;
using IntelliBiz.API.Models;
using IntelliBiz.API.Services;

namespace IntelliBiz.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BusinessController : ControllerBase
{
    private readonly IBusinessService _service;

    public BusinessController(IBusinessService service)
    {
        _service = service;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Business>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Business>>> GetBusinesses()
    {
        var businesses = await _service.GetAllBusinessesAsync();
        return Ok(businesses);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Business), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Business>> GetBusiness(int id)
    {
        var business = await _service.GetBusinessByIdAsync(id);
        if (business == null)
        {
            return NotFound();
        }

        return Ok(business);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Business), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Business>> CreateBusiness(CreateBusinessRequest business)
    {
        try
        {
            var createdBusiness = await _service.CreateBusinessAsync(business);
            return CreatedAtAction(nameof(GetBusiness), new { id = createdBusiness.Id }, createdBusiness);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateBusiness(int id, UpdateBusinessRequest business)
    {
        var result = await _service.UpdateBusinessAsync(id, business);
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteBusiness(int id)
    {
        var result = await _service.DeleteBusinessAsync(id);
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
} 