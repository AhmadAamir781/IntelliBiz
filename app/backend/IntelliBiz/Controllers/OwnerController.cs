//using IntelliBiz.API.Models;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using System.Security.Claims;
//using IntelliBiz.Repositories;

//namespace IntelliBiz.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    [Authorize(Roles = "BusinessOwner,Admin")]
//    public class OwnerController : ControllerBase
//    {
//        private readonly IBusinessRepository _businessRepository;
//        private readonly IAppointmentRepository _appointmentRepository;
//        private readonly IMessageRepository _messageRepository;
//        private readonly ILogger<OwnerController> _logger;

//        public OwnerController(
//            IBusinessRepository businessRepository,
//            IAppointmentRepository appointmentRepository,
//            IMessageRepository messageRepository,
//            ILogger<OwnerController> logger)
//        {
//            _businessRepository = businessRepository;
//            _appointmentRepository = appointmentRepository;
//            _messageRepository = messageRepository;
//            _logger = logger;
//        }

//        // GET: api/owner/statistics
//        [HttpGet("statistics")]
//        public async Task<ActionResult<OwnerStatistics>> GetStatistics()
//        {
//            try
//            {
//                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
//                if (userIdClaim == null)
//                {
//                    return Unauthorized("User ID not found in token");
//                }

//                if (!int.TryParse(userIdClaim.Value, out int ownerId))
//                {
//                    return BadRequest("Invalid user ID format");
//                }

//                // Get all businesses owned by this user
//                var businesses = await _businessRepository.GetBusinessesByOwnerIdAsync(ownerId);
//                var businessIds = businesses.Select(b => b.Id).ToList();

//                if (!businessIds.Any())
//                {
//                    return Ok(new OwnerStatistics()); // Return empty statistics if no businesses
//                }

//                // Get statistics for all businesses owned by this user
//                var statistics = new OwnerStatistics
//                {
//                    TotalAppointments = await _appointmentRepository.GetAppointmentsCountByBusinessIdsAsync(businessIds),
//                    PendingAppointments = await _appointmentRepository.GetPendingAppointmentsCountByBusinessIdsAsync(businessIds),
//                    TotalServices = businesses.Sum(b => b.Services.Count),
//                    TotalMessages = await _messageRepository.GetMessagesCountByBusinessIdsAsync(businessIds),
//                    UnreadMessages = await _messageRepository.GetUnreadMessagesCountByBusinessIdsAsync(businessIds),
//                    AverageRating = businesses.Any() ? businesses.Average(b => b.AverageRating) : 0,
//                    ReviewCount = businesses.Sum(b => b.ReviewCount),
//                    // Add more statistics as needed
//                };

//                return Ok(statistics);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error retrieving owner statistics");
//                return StatusCode(500, "An error occurred while retrieving statistics");
//            }
//        }

//        // GET: api/owner/appointments
//        [HttpGet("appointments")]
//        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments(string? status = null)
//        {
//            try
//            {
//                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
//                if (userIdClaim == null)
//                {
//                    return Unauthorized("User ID not found in token");
//                }

//                if (!int.TryParse(userIdClaim.Value, out int ownerId))
//                {
//                    return BadRequest("Invalid user ID format");
//                }

//                // Get all businesses owned by this user
//                var businesses = await _businessRepository.GetBusinessesByOwnerIdAsync(ownerId);
//                var businessIds = businesses.Select(b => b.Id).ToList();

//                if (!businessIds.Any())
//                {
//                    return Ok(new List<Appointment>()); // Return empty list if no businesses
//                }

//                // Get appointments for all businesses owned by this user
//                var appointments = await _appointmentRepository.GetAppointmentsByBusinessIdsAsync(businessIds, status);
//                return Ok(appointments);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error retrieving appointments for owner");
//                return StatusCode(500, "An error occurred while retrieving appointments");
//            }
//        }

//        // PUT: api/owner/appointments/{id}/status
//        [HttpPut("appointments/{id}/status")]
//        public async Task<IActionResult> UpdateAppointmentStatus(int id, [FromBody] string status)
//        {
//            try
//            {
//                if (string.IsNullOrEmpty(status))
//                {
//                    return BadRequest("Status cannot be empty");
//                }

//                if (status != "Pending" && status != "Confirmed" && status != "Completed" && status != "Cancelled")
//                {
//                    return BadRequest("Invalid status. Valid statuses are: Pending, Confirmed, Completed, Cancelled");
//                }

//                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
//                if (userIdClaim == null)
//                {
//                    return Unauthorized("User ID not found in token");
//                }

//                if (!int.TryParse(userIdClaim.Value, out int ownerId))
//                {
//                    return BadRequest("Invalid user ID format");
//                }

//                var appointment = await _appointmentRepository.GetAppointmentByIdAsync(id);
//                if (appointment == null)
//                {
//                    return NotFound($"Appointment with ID {id} not found");
//                }

//                // Get all businesses owned by this user
//                var businesses = await _businessRepository.GetBusinessesByOwnerIdAsync(ownerId);
//                var businessIds = businesses.Select(b => b.Id).ToList();

//                // Check if the appointment belongs to one of the owner's businesses
//                if (!businessIds.Contains(appointment.BusinessId))
//                {
//                    return Forbid("You don't have permission to update this appointment");
//                }

//                var success = await _appointmentRepository.UpdateAppointmentStatusAsync(id, status);

//                if (!success)
//                {
//                    return StatusCode(500, "Failed to update appointment status");
//                }

//                return NoContent();
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error updating status for appointment {Id}", id);
//                return StatusCode(500, "An error occurred while updating the appointment status");
//            }
//        }

//        // GET: api/owner/messages
//        [HttpGet("messages")]
//        public async Task<ActionResult<IEnumerable<Message>>> GetMessages(bool unreadOnly = false)
//        {
//            try
//            {
//                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
//                if (userIdClaim == null)
//                {
//                    return Unauthorized("User ID not found in token");
//                }

//                if (!int.TryParse(userIdClaim.Value, out int ownerId))
//                {
//                    return BadRequest("Invalid user ID format");
//                }

//                // Get all businesses owned by this user
//                var businesses = await _businessRepository.GetBusinessesByOwnerIdAsync(ownerId);
//                var businessIds = businesses.Select(b => b.Id).ToList();

//                if (!businessIds.Any())
//                {
//                    return Ok(new List<Message>()); // Return empty list if no businesses
//                }

//                // Get messages for all businesses owned by this user
//                var messages = await _messageRepository.GetMessagesByBusinessIdsAsync(businessIds, unreadOnly);
//                return Ok(messages);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error retrieving messages for owner");
//                return StatusCode(500, "An error occurred while retrieving messages");
//            }
//        }

//        // PUT: api/owner/messages/{id}/read
//        [HttpPut("messages/{id}/read")]
//        public async Task<IActionResult> MarkMessageAsRead(int id)
//        {
//            try
//            {
//                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
//                if (userIdClaim == null)
//                {
//                    return Unauthorized("User ID not found in token");
//                }

//                if (!int.TryParse(userIdClaim.Value, out int ownerId))
//                {
//                    return BadRequest("Invalid user ID format");
//                }

//                var message = await _messageRepository.GetMessageByIdAsync(id);
//                if (message == null)
//                {
//                    return NotFound($"Message with ID {id} not found");
//                }

//                // Get all businesses owned by this user
//                var businesses = await _businessRepository.GetBusinessesByOwnerIdAsync(ownerId);
//                var businessIds = businesses.Select(b => b.Id).ToList();

//                // Check if the message belongs to one of the owner's businesses
//                if (message.BusinessId.HasValue && !businessIds.Contains(message.BusinessId.Value))
//                {
//                    return Forbid("You don't have permission to update this message");
//                }

//                // Check if the owner is the receiver
//                if (message.ReceiverId != ownerId)
//                {
//                    return Forbid("You don't have permission to update this message");
//                }

//                var success = await _messageRepository.MarkMessageAsReadAsync(id);

//                if (!success)
//                {
//                    return StatusCode(500, "Failed to mark message as read");
//                }

//                return NoContent();
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error marking message {Id} as read", id);
//                return StatusCode(500, "An error occurred while updating the message");
//            }
//        }
//    }
//}