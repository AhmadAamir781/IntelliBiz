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
    public class MessagesController : ControllerBase
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IBusinessRepository _businessRepository;
        private readonly ILogger<MessagesController> _logger;

        public MessagesController(
            IMessageRepository messageRepository,
            IBusinessRepository businessRepository,
            ILogger<MessagesController> logger)
        {
            _messageRepository = messageRepository;
            _businessRepository = businessRepository;
            _logger = logger;
        }

        // GET: api/messages/conversations
        [HttpGet("conversations")]
        public async Task<ActionResult<IEnumerable<Conversation>>> GetUserConversations()
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

                var conversations = await _messageRepository.GetUserConversationsAsync(userId);
                return Ok(conversations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user conversations");
                return StatusCode(500, "An error occurred while retrieving conversations");
            }
        }

        // GET: api/messages/business/{businessId}/conversations
        [HttpGet("business/{businessId}/conversations")]
        public async Task<ActionResult<IEnumerable<Conversation>>> GetBusinessConversations(int businessId)
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
                    return Forbid("You don't have permission to view conversations for this business");
                }

                var conversations = await _messageRepository.GetBusinessConversationsAsync(businessId);
                return Ok(conversations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving conversations for business {BusinessId}", businessId);
                return StatusCode(500, "An error occurred while retrieving conversations");
            }
        }

        // GET: api/messages/conversation/{id}
        [HttpGet("conversation/{id}")]
        public async Task<ActionResult<Conversation>> GetConversation(int id)
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

                var conversation = await _messageRepository.GetConversationByIdAsync(id);
                if (conversation == null)
                {
                    return NotFound($"Conversation with ID {id} not found");
                }

                // Check if user is a participant in the conversation or the business owner
                var business = await _businessRepository.GetBusinessByIdAsync(conversation.BusinessId);
                if (conversation.UserId != userId && business?.OwnerId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to view this conversation");
                }

                return Ok(conversation);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving conversation with ID {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the conversation");
            }
        }

        // GET: api/messages/conversation/{id}/messages
        [HttpGet("conversation/{id}/messages")]
        public async Task<ActionResult<IEnumerable<Message>>> GetConversationMessages(int id)
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

                var conversation = await _messageRepository.GetConversationByIdAsync(id);
                if (conversation == null)
                {
                    return NotFound($"Conversation with ID {id} not found");
                }

                // Check if user is a participant in the conversation or the business owner
                var business = await _businessRepository.GetBusinessByIdAsync(conversation.BusinessId);
                if (conversation.UserId != userId && business?.OwnerId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to view messages in this conversation");
                }

                var messages = await _messageRepository.GetMessagesByConversationIdAsync(id);

                // Mark messages as read
                await _messageRepository.MarkConversationAsReadAsync(id, userId);

                return Ok(messages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving messages for conversation {Id}", id);
                return StatusCode(500, "An error occurred while retrieving messages");
            }
        }

        // POST: api/messages/conversation
        [HttpPost("conversation")]
        public async Task<ActionResult<Conversation>> CreateConversation(Conversation conversation)
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

                var business = await _businessRepository.GetBusinessByIdAsync(conversation.BusinessId);
                if (business == null)
                {
                    return NotFound($"Business with ID {conversation.BusinessId} not found");
                }

                // Check if conversation already exists
                var existingConversation = await _messageRepository.GetConversationByUserAndBusinessAsync(userId, conversation.BusinessId);
                if (existingConversation != null)
                {
                    return Ok(existingConversation); // Return existing conversation
                }

                conversation.UserId = userId;
                conversation.CreatedAt = DateTime.UtcNow;

                var id = await _messageRepository.CreateConversationAsync(conversation);
                conversation.Id = id;

                return CreatedAtAction(nameof(GetConversation), new { id }, conversation);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating conversation");
                return StatusCode(500, "An error occurred while creating the conversation");
            }
        }

        // POST: api/messages
        [HttpPost]
        public async Task<ActionResult<Message>> CreateMessage(Message message)
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

                var conversation = await _messageRepository.GetConversationByIdAsync(message.ConversationId);
                if (conversation == null)
                {
                    return NotFound($"Conversation with ID {message.ConversationId} not found");
                }

                // Check if user is a participant in the conversation or the business owner
                var business = await _businessRepository.GetBusinessByIdAsync(conversation.BusinessId);
                if (conversation.UserId != userId && business?.OwnerId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to send messages in this conversation");
                }

                message.SenderId = userId;
                message.IsRead = false;
                message.CreatedAt = DateTime.UtcNow;

                var id = await _messageRepository.CreateMessageAsync(message);
                message.Id = id;

                return Ok(message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating message");
                return StatusCode(500, "An error occurred while creating the message");
            }
        }

        // POST: api/messages/conversation/{id}/read
        [HttpPost("conversation/{id}/read")]
        public async Task<IActionResult> MarkConversationAsRead(int id)
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

                var conversation = await _messageRepository.GetConversationByIdAsync(id);
                if (conversation == null)
                {
                    return NotFound($"Conversation with ID {id} not found");
                }

                // Check if user is a participant in the conversation or the business owner
                var business = await _businessRepository.GetBusinessByIdAsync(conversation.BusinessId);
                if (conversation.UserId != userId && business?.OwnerId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to mark messages as read in this conversation");
                }

                await _messageRepository.MarkConversationAsReadAsync(id, userId);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking conversation {Id} as read", id);
                return StatusCode(500, "An error occurred while marking the conversation as read");
            }
        }

        // GET: api/messages/unread-count
        [HttpGet("unread-count")]
        public async Task<ActionResult<int>> GetUnreadMessageCount()
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

                var count = await _messageRepository.GetTotalUnreadMessageCountAsync(userId);
                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving unread message count");
                return StatusCode(500, "An error occurred while retrieving unread message count");
            }
        }
    }
}