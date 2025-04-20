using IntelliBiz.API.DTOs;
using IntelliBiz.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IntelliBiz.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IBusinessService _businessService;

        public AppointmentsController(IAppointmentService appointmentService, IBusinessService businessService)
        {
            _appointmentService = appointmentService;
            _businessService = businessService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAll()
        {
            var appointments = await _appointmentService.GetAllAsync();
            return Ok(appointments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentDto>> GetById(int id)
        {
            var appointment = await _appointmentService.GetByIdAsync(id);
            if (appointment == null)
            {
                return NotFound(new { message = "Appointment not found" });
            }

            // Check if user is the customer, business owner, or admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var business = await _businessService.GetByIdAsync(appointment.BusinessId);

            if (appointment.UserId != userId && (business == null || business.OwnerId != userId) && userRole != "Admin")
            {
                return Forbid();
            }

            return Ok(appointment);
        }

        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetUserAppointments()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var appointments = await _appointmentService.GetByUserIdAsync(userId);
            return Ok(appointments);
        }

        [HttpGet("business/{businessId}")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetBusinessAppointments(int businessId)
        {
            // Check if user is the business owner or admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var business = await _businessService.GetByIdAsync(businessId);

            if (business == null)
            {
                return NotFound(new { message = "Business not found" });
            }

            if (business.OwnerId != userId && userRole != "Admin")
            {
                return Forbid();
            }

            var appointments = await _appointmentService.GetByBusinessIdAsync(businessId);
            return Ok(appointments);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<AppointmentDto>>> Create([FromBody] AppointmentDto appointmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponseDto<AppointmentDto>.ErrorResponse("Invalid appointment data"));
            }

            // Set user ID from the authenticated user
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            appointmentDto.UserId = userId;

            var response = await _appointmentService.CreateAsync(appointmentDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return CreatedAtAction(nameof(GetById), new { id = response.Data.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<AppointmentDto>>> Update(int id, [FromBody] AppointmentDto appointmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponseDto<AppointmentDto>.ErrorResponse("Invalid appointment data"));
            }

            // Check if user is the customer, business owner, or admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var appointment = await _appointmentService.GetByIdAsync(id);

            if (appointment == null)
            {
                return NotFound(ApiResponseDto<AppointmentDto>.ErrorResponse("Appointment not found"));
            }

            var business = await _businessService.GetByIdAsync(appointment.BusinessId);
            if (appointment.UserId != userId && (business == null || business.OwnerId != userId) && userRole != "Admin")
            {
                return Forbid();
            }

            var response = await _appointmentService.UpdateAsync(id, appointmentDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            // Check if user is the customer, business owner, or admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var appointment = await _appointmentService.GetByIdAsync(id);

            if (appointment == null)
            {
                return NotFound(ApiResponseDto<bool>.ErrorResponse("Appointment not found"));
            }

            var business = await _businessService.GetByIdAsync(appointment.BusinessId);
            if (appointment.UserId != userId && (business == null || business.OwnerId != userId) && userRole != "Admin")
            {
                return Forbid();
            }

            var response = await _appointmentService.DeleteAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<ApiResponseDto<bool>>> UpdateStatus(int id, [FromBody] string status)
        {
            // Check if user is the customer, business owner, or admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var appointment = await _appointmentService.GetByIdAsync(id);

            if (appointment == null)
            {
                return NotFound(ApiResponseDto<bool>.ErrorResponse("Appointment not found"));
            }

            var business = await _businessService.GetByIdAsync(appointment.BusinessId);
            
            // Only business owners can confirm or complete appointments
            if ((status == "Confirmed" || status == "Completed") && 
                (business == null || business.OwnerId != userId) && userRole != "Admin")
            {
                return Forbid();
            }
            
            // Only customers can cancel their own appointments
            if (status == "Cancelled" && appointment.UserId != userId && userRole != "Admin")
            {
                return Forbid();
            }

            var response = await _appointmentService.UpdateStatusAsync(id, status);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
    }
}
