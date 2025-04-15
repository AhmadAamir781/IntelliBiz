using Microsoft.AspNetCore.Mvc;
using IntelliBiz.API.Models;
using IntelliBiz.API.Repositories;

namespace IntelliBiz.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly ILogger<CategoryController> _logger;

    public CategoryController(ICategoryRepository categoryRepository, ILogger<CategoryController> logger)
    {
        _categoryRepository = categoryRepository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        try
        {
            var categories = await _categoryRepository.GetAllAsync();
            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting categories");
            return StatusCode(500, "An error occurred while retrieving categories");
        }
    }
} 