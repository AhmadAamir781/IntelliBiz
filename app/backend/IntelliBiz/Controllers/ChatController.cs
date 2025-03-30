
using IntelliBiz.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntelliBiz.Controllers;

public class ChatController : BaseController
{
    private readonly IChatRepository _chatRepository;
    private readonly ILogger<ChatController> _logger;

    public ChatController(IChatRepository chatRepository, ILogger<ChatController> logger)
    {
        _chatRepository = chatRepository;
        _logger = logger;
    }

    [Authorize]
    [HttpPost("businesses/{businessId}")]
    public async Task<IActionResult> CreateChatRoom(int businessId)
    {
        try
        {
            var userId = GetUserId();
            var chatRoom = await _chatRepository.CreateChatRoomAsync(businessId, userId);
            return Ok(chatRoom);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating chat room");
            return HandleException(ex);
        }
    }

    [Authorize]
    [HttpGet("rooms")]
    public async Task<IActionResult> GetUserChatRooms()
    {
        try
        {
            var userId = GetUserId();
            var chatRooms = await _chatRepository.GetUserChatRoomsAsync(userId);
            return Ok(chatRooms);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user chat rooms");
            return HandleException(ex);
        }
    }

    [Authorize]
    [HttpGet("rooms/{chatRoomId}/messages")]
    public async Task<IActionResult> GetChatMessages(int chatRoomId, [FromQuery] int? lastMessageId)
    {
        try
        {
            var messages = await _chatRepository.GetChatMessagesAsync(chatRoomId, lastMessageId);
            return Ok(messages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting chat messages");
            return HandleException(ex);
        }
    }
} 