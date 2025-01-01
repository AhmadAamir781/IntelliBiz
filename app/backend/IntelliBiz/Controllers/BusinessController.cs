using IntelliBiz.Models;
using IntelliBiz.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IntelliBiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessController : ControllerBase
    {
        private readonly BusinessService _service;

        public BusinessController(BusinessService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetBusinesses()
        {
            var businesses = await _service.GetAllBusinessesAsync();
            return Ok(businesses);
        }

        [HttpPost]
        public async Task<IActionResult> AddBusiness(Business business)
        {
            await _service.AddBusinessAsync(business);
            return CreatedAtAction(nameof(GetBusinesses), new { id = business.Id }, business);
        }

    }
}
