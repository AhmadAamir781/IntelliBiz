using IntelliBiz.API.Models;

namespace IntelliBiz.Repositories
{
    public interface IMessageRepository
    {
        Task<IEnumerable<Message>> GetMessagesByConversationIdAsync(int conversationId);
        Task<IEnumerable<Conversation>> GetUserConversationsAsync(int userId);
        Task<IEnumerable<Conversation>> GetBusinessConversationsAsync(int businessId);
        Task<Conversation?> GetConversationByIdAsync(int id);
        Task<Conversation?> GetConversationByUserAndBusinessAsync(int userId, int businessId);
        Task<int> CreateConversationAsync(Conversation conversation);
        Task<int> CreateMessageAsync(Message message);
        Task<bool> MarkConversationAsReadAsync(int conversationId, int userId);
        Task<int> GetUnreadMessageCountAsync(int conversationId, int userId);
        Task<int> GetTotalUnreadMessageCountAsync(int userId);
    }
}