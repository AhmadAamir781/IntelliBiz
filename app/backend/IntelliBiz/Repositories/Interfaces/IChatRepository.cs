
using IntelliBiz.Models;

namespace IntelliBiz.Repositories.Interfaces;

public interface IChatRepository
{
    Task<ChatRoom> CreateChatRoomAsync(int businessId, int userId);
    Task<IEnumerable<ChatRoomResponse>> GetUserChatRoomsAsync(int userId);
    Task<IEnumerable<ChatMessageResponse>> GetChatMessagesAsync(int chatRoomId, int? lastMessageId = null);
    Task<ChatMessage> SaveChatMessageAsync(int chatRoomId, int senderId, CreateChatMessageRequest request);
} 