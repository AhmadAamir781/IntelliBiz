using IntelliBiz.Models;

namespace IntelliBiz.Repositories.Interfaces
{
    public interface IMessageRepository
    {
        Task<int> CreateMessageAsync(Message message);
        Task<int> DeleteMessageAsync(int messageId);
        Task<IEnumerable<Message>> GetAllMessagesAsync(int chatId);
        Task<Message> ReadMessageAsync(int messageId);
        Task<int> UpdateMessageAsync(Message message);
    }
}