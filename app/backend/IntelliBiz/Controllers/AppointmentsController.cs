using IntelliBiz.API.Models;
using IntelliBiz.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IntelliBiz.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IBusinessRepository _businessRepository;
        private readonly ILogger<AppointmentsController> _logger;

        public AppointmentsController(
            IAppointmentRepository appointmentRepository,
            IBusinessRepository businessRepository,
            ILogger<AppointmentsController> logger)
        {
            _appointmentRepository = appointmentRepository;
            _businessRepository = businessRepository;
            _logger = logger;
        }

        // GET: api/appointments/business/{businessId}
        [HttpGet("business/{businessId}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetBusinessAppointments(int businessId)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var business = await _businessRepository.GetBusinessByIdAsync(businessId);
                if (business == null)
                {
                    return NotFound($"Business with ID {businessId} not found");
                }

                // Check if user is the owner of the business or an admin
                if (business.OwnerId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to view appointments for this business");
                }

                var appointments = await _appointmentRepository.GetAppointmentsByBusinessIdAsync(businessId);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving appointments for business {BusinessId}", businessId);
                return StatusCode(500, "An error occurred while retrieving appointments");
            }
        }

        // GET: api/appointments/user
        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetUserAppointments()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var appointments = await _appointmentRepository.GetAppointmentsByUserIdAsync(userId);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user appointments");
                return StatusCode(500, "An error occurred while retrieving appointments");
            }
        }

        // GET: api/appointments/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var appointment = await _appointmentRepository.GetAppointmentByIdAsync(id);

                if (appointment == null)
                {
                    return NotFound($"Appointment with ID {id} not found");
                }

                // Check if user is the owner of the appointment, the business owner, or an admin
                var business = await _businessRepository.GetBusinessByIdAsync(appointment.BusinessId);
                if (appointment.UserId != userId && business?.OwnerId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to view this appointment");
                }

                return Ok(appointment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving appointment with ID {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the appointment");
            }
        }

        // POST: api/appointments
        [HttpPost]
        public async Task<ActionResult<Appointment>> CreateAppointment(Appointment appointment)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var business = await _businessRepository.GetBusinessByIdAsync(appointment.BusinessId);
                if (business == null)
                {
                    return NotFound($"Business with ID {appointment.BusinessId} not found");
                }

                // Validate appointment date and time
                if (appointment.AppointmentDate.Date < DateTime.UtcNow.Date)
                {
                    return BadRequest("Appointment date cannot be in the past");
                }

                // Check if the business is open on the appointment day
                var dayOfWeek = (int)appointment.AppointmentDate.DayOfWeek;
                var businessHours = business.BusinessHours.FirstOrDefault(h => h.DayOfWeek == dayOfWeek);

                if (businessHours == null || businessHours.IsClosed)
                {
                    return BadRequest("The business is closed on the selected day");
                }

                // Check if the appointment time is within business hours
                var openTime = TimeSpan.Parse(businessHours.OpenTime);
                var closeTime = TimeSpan.Parse(businessHours.CloseTime);

                if (appointment.StartTime < openTime || appointment.EndTime > closeTime)
                {
                    return BadRequest("Appointment time is outside business hours");
                }

                appointment.UserId = userId;
                appointment.Status = "Pending";
                appointment.CreatedAt = DateTime.UtcNow;

                var id = await _appointmentRepository.CreateAppointmentAsync(appointment);
                appointment.Id = id;

                return CreatedAtAction(nameof(GetAppointment), new { id }, appointment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating appointment");
                return StatusCode(500, "An error occurred while creating the appointment");
            }
        }

        // PUT: api/appointments/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, Appointment appointment)
        {
            try
            {
                if (id != appointment.Id)
                {
                    return BadRequest("ID in URL does not match ID in request body");
                }

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var existingAppointment = await _appointmentRepository.GetAppointmentByIdAsync(id);
                if (existingAppointment == null)
                {
                    return NotFound($"Appointment with ID {id} not found");
                }

                // Check if user is the owner of the appointment, the business owner, or an admin
                var business = await _businessRepository.GetBusinessByIdAsync(existingAppointment.BusinessId);
                if (existingAppointment.UserId != userId && business?.OwnerId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to update this appointment");
                }

                // Validate appointment date and time
                if (appointment.AppointmentDate.Date < DateTime.UtcNow.Date)
                {
                    return BadRequest("Appointment date cannot be in the past");
                }

                // Check if the business is open on the appointment day
                var dayOfWeek = (int)appointment.AppointmentDate.DayOfWeek;
                var businessHours = business?.BusinessHours.FirstOrDefault(h => h.DayOfWeek == dayOfWeek);

                if (businessHours == null || businessHours.IsClosed)
                {
                    return BadRequest("The business is closed on the selected day");
                }

                // Check if the appointment time is within business hours
                var openTime = TimeSpan.Parse(businessHours.OpenTime);
                var closeTime = TimeSpan.Parse(businessHours.CloseTime);

                if (appointment.StartTime < openTime || appointment.EndTime > closeTime)
                {
                    return BadRequest("Appointment time is outside business hours");
                }

                appointment.UserId = existingAppointment.UserId;
                appointment.BusinessId = existingAppointment.BusinessId;
                appointment.CreatedAt = existingAppointment.CreatedAt;
                appointment.UpdatedAt = DateTime.UtcNow;

                var success = await _appointmentRepository.UpdateAppointmentAsync(appointment);

                if (!success)
                {
                    return StatusCode(500, "Failed to update appointment");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating appointment with ID {Id}", id);
                return StatusCode(500, "An error occurred while updating the appointment");
            }
        }

        // PUT: api/appointments/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateAppointmentStatus(int id, [FromBody] string status)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var existingAppointment = await _appointmentRepository.GetAppointmentByIdAsync(id);
                if (existingAppointment == null)
                {
                    return NotFound($"Appointment with ID {id} not found");
                }

                // Check if user is the owner of the appointment, the business owner, or an admin
                var business = await _businessRepository.GetBusinessByIdAsync(existingAppointment.BusinessId);
                if (existingAppointment.UserId != userId && business?.OwnerId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to update this appointment");
                }

                // Validate status
                if (status != "Pending" && status != "Confirmed" && status != "Completed" && status != "Cancelled")
                {
                    return BadRequest("Invalid status. Status must be 'Pending', 'Confirmed', 'Completed', or 'Cancelled'");
                }

                var success = await _appointmentRepository.UpdateAppointmentStatusAsync(id, status);

                if (!success)
                {
                    return StatusCode(500, "Failed to update appointment status");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating status for appointment with ID {Id}", id);
                return StatusCode(500, "An error occurred while updating the appointment status");
            }
        }

        // DELETE: api/appointments/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var existingAppointment = await _appointmentRepository.GetAppointmentByIdAsync(id);
                if (existingAppointment == null)
                {
                    return NotFound($"Appointment with ID {id} not found");
                }

                // Check if user is the owner of the appointment, the business owner, or an admin
                var business = await _businessRepository.GetBusinessByIdAsync(existingAppointment.BusinessId);
                if (existingAppointment.UserId != userId && business?.OwnerId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to delete this appointment");
                }

                var success = await _appointmentRepository.DeleteAppointmentAsync(id);

                if (!success)
                {
                    return StatusCode(500, "Failed to delete appointment");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting appointment with ID {Id}", id);
                return StatusCode(500, "An error occurred while deleting the appointment");
            }
        }

        // GET: api/appointments/business/{businessId}/date/{date}
        [HttpGet("business/{businessId}/date/{date}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetBusinessAppointmentsByDate(int businessId, DateTime date)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var business = await _businessRepository.GetBusinessByIdAsync(businessId);
                if (business == null)
                {
                    return NotFound($"Business with ID {businessId} not found");
                }

                // Check if user is the owner of the business or an admin
                if (business.OwnerId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to view appointments for this business");
                }

                var appointments = await _appointmentRepository.GetBusinessAppointmentsByDateAsync(businessId, date);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving appointments for business {BusinessId} on date {Date}", businessId, date);
                return StatusCode(500, "An error occurred while retrieving appointments");
            }
        }

        // GET: api/appointments/user/range
        [HttpGet("user/range")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetUserAppointmentsByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var appointments = await _appointmentRepository.GetUserAppointmentsByDateRangeAsync(userId, startDate, endDate);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user appointments for date range {StartDate} to {EndDate}", startDate, endDate);
                return StatusCode(500, "An error occurred while retrieving appointments");
            }
        }
    }
}