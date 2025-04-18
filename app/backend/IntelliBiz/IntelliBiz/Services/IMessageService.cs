using IntelliBiz.API.DTOs;

namespace IntelliBiz.API.Services
{
    public interface IMessageService
    {
        Task<MessageDto?> GetByIdAsync(int id);
        Task<IEnumerable<MessageDto>> GetAllAsync();
        Task<IEnumerable<MessageDto>> GetBySenderIdAsync(int senderId);
        Task<IEnumerable<MessageDto>> GetByReceiverIdAsync(int receiverId);
        Task<IEnumerable<MessageDto>> GetConversationAsync(int user1Id, int user2Id);
        Task<ApiResponseDto<MessageDto>> CreateAsync(MessageDto messageDto);
        Task<ApiResponseDto<bool>> DeleteAsync(int id);
        Task<ApiResponseDto<bool>> MarkAsReadAsync(int id);
        Task<ApiResponseDto<bool>> MarkAllAsReadAsync(int receiverId, int senderId);
    }
}
