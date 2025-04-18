using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories
{
    public interface IMessageRepository
    {
        Task<List<Message>?> GetByBusinessIdAsync(int id);
        Task<Message?> GetByIdAsync(int id);
        Task<IEnumerable<Message>> GetAllAsync();
        Task<IEnumerable<Message>> GetBySenderIdAsync(int senderId);
        Task<IEnumerable<Message>> GetByReceiverIdAsync(int receiverId);
        Task<IEnumerable<Message>> GetConversationAsync(int user1Id, int user2Id);
        Task<int> CreateAsync(Message message);
        Task<bool> DeleteAsync(int id);
        Task<bool> MarkAsReadAsync(int id);
        Task<bool> MarkAllAsReadAsync(int receiverId, int senderId);
    }
}
