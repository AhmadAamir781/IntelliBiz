
using IntelliBiz.Models;
using IntelliBiz.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace IntelliBiz.Hubs;

public class ChatHub : Hub
{
    private readonly IChatRepository _chatRepository;
    private readonly ILogger<ChatHub> _logger;

    public ChatHub(IChatRepository chatRepository, ILogger<ChatHub> logger)
    {
        _chatRepository = chatRepository;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();
        await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"User_{userId}");
        await base.OnDisconnectedAsync(exception);
    }

    [Authorize]
    public async Task JoinChatRoom(int chatRoomId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"ChatRoom_{chatRoomId}");
    }

    [Authorize]
    public async Task LeaveChatRoom(int chatRoomId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"ChatRoom_{chatRoomId}");
    }

    [Authorize]
    public async Task SendMessage(int chatRoomId, string message)
    {
        try
        {
            var userId = GetUserId();
            var request = new CreateChatMessageRequest { Message = message };
            var savedMessage = await _chatRepository.SaveChatMessageAsync(chatRoomId, userId, request);

            var messageResponse = new ChatMessageResponse
            {
                MessageId = savedMessage.MessageId,
                Message = savedMessage.Message,
                CreatedAt = savedMessage.CreatedAt,
                SenderName = Context.User?.Identity?.Name ?? "Unknown",
                SenderEmail = Context.User?.FindFirst(ClaimTypes.Email)?.Value ?? "unknown@example.com"
            };

            await Clients.Group($"ChatRoom_{chatRoomId}").SendAsync("ReceiveMessage", messageResponse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending message");
            throw;
        }
    }

    private int GetUserId()
    {
        var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }
        return userId;
    }
} 