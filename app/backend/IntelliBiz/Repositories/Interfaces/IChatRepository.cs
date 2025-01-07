using IntelliBiz.Models;

namespace IntelliBiz.Repositories.Interfaces
{
    public interface IChatRepository
    {
        Task<int> CreateChatAsync(Chat chat);
        Task<int> DeleteChatAsync(int chatId);
        Task<IEnumerable<Chat>> GetAllChatsAsync(int businessId);
        Task<Chat> ReadChatAsync(int chatId);
        Task<int> UpdateChatAsync(Chat chat);
    }
}