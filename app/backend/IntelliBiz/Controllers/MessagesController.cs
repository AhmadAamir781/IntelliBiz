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
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService _messageService;
        private readonly IBusinessService _businessService;

        public MessagesController(IMessageService messageService, IBusinessService businessService)
        {
            _messageService = messageService;
            _businessService = businessService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetAll()
        {
            var messages = await _messageService.GetAllAsync();
            return Ok(messages);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MessageDto>> GetById(int id)
        {
            var message = await _messageService.GetByIdAsync(id);
            if (message == null)
            {
                return NotFound(new { message = "Message not found" });
            }

            // Check if user is the sender, recipient, or admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var business = await _businessService.GetByIdAsync(message.BusinessId);

            if (message.UserId != userId && (business == null || business.OwnerId != userId) && userRole != "Admin")
            {
                return Forbid();
            }

            return Ok(message);
        }

        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetUserMessages()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var messages = await _messageService.GetBySenderIdAsync(userId);
            return Ok(messages);
        }

        [HttpGet("business/{businessId}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetBusinessMessages(int businessId)
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

            var messages = await _messageService.GetConversationAsync(userId, businessId);
            return Ok(messages);
        }

        [HttpGet("conversation")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetConversation([FromQuery] int userId, [FromQuery] int businessId)
        {
            // Check if user is the sender, recipient, or admin
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var business = await _businessService.GetByIdAsync(businessId);

            if (currentUserId != userId && (business == null || business.OwnerId != currentUserId) && userRole != "Admin")
            {
                return Forbid();
            }

            var messages = await _messageService.GetConversationAsync(userId, businessId);
            return Ok(messages);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<MessageDto>>> Create([FromBody] MessageDto messageDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponseDto<MessageDto>.ErrorResponse("Invalid message data"));
            }

            // Set user ID from the authenticated user if sending as user
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            
            // If sending as business, verify ownership
            if (messageDto.IsFromBusiness)
            {
                var business = await _businessService.GetByIdAsync(messageDto.BusinessId);
                if (business == null)
                {
                    return NotFound(ApiResponseDto<MessageDto>.ErrorResponse("Business not found"));
                }

                if (business.OwnerId != userId && userRole != "Admin")
                {
                    return Forbid();
                }
            }
            else
            {
                messageDto.UserId = userId;
            }

            var response = await _messageService.CreateAsync(messageDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return CreatedAtAction(nameof(GetById), new { id = response.Data.Id }, response);
        }

        [HttpPatch("{id}/read")]
        public async Task<ActionResult<ApiResponseDto<bool>>> MarkAsRead(int id)
        {
            // Check if user is the recipient
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var message = await _messageService.GetByIdAsync(id);

            if (message == null)
            {
                return NotFound(ApiResponseDto<bool>.ErrorResponse("Message not found"));
            }

            var business = await _businessService.GetByIdAsync(message.BusinessId);
            
            // Check if the user is the intended recipient
            bool isRecipient = false;
            if (message.IsFromBusiness)
            {
                // If message is from business, user should be the recipient
                isRecipient = message.UserId == userId;
            }
            else
            {
                // If message is from user, business owner should be the recipient
                isRecipient = business != null && business.OwnerId == userId;
            }

            if (!isRecipient && userRole != "Admin")
            {
                return Forbid();
            }

            var response = await _messageService.MarkAsReadAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            // Check if user is the sender, recipient, or admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var message = await _messageService.GetByIdAsync(id);

            if (message == null)
            {
                return NotFound(ApiResponseDto<bool>.ErrorResponse("Message not found"));
            }

            var business = await _businessService.GetByIdAsync(message.BusinessId);
            if (message.UserId != userId && (business == null || business.OwnerId != userId) && userRole != "Admin")
            {
                return Forbid();
            }

            var response = await _messageService.DeleteAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
    }
}
