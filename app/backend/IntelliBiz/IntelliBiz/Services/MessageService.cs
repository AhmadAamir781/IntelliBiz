using IntelliBiz.DTOs;
using IntelliBiz.Models;
using IntelliBiz.Repositories;

namespace IntelliBiz.Services
{
    public class MessageService(IMessageRepository messageRepository) : IMessageService
    {
        public async Task<MessageDto?> GetByIdAsync(int id)
        {
            var message = await messageRepository.GetByIdAsync(id);
            if (message == null)
                return null;

            return MapToDto(message);
        }

        public async Task<IEnumerable<MessageDto>> GetAllAsync()
        {
            var messages = await messageRepository.GetAllAsync();
            return messages.Select(MapToDto);
        }

        public async Task<IEnumerable<MessageDto>> GetBySenderIdAsync(int senderId)
        {
            var messages = await messageRepository.GetBySenderIdAsync(senderId);
            return messages.Select(MapToDto);
        }

        public async Task<IEnumerable<MessageDto>> GetByReceiverIdAsync(int receiverId)
        {
            var messages = await messageRepository.GetByReceiverIdAsync(receiverId);
            return messages.Select(MapToDto);
        }

        public async Task<IEnumerable<MessageDto>> GetConversationAsync(int user1Id, int user2Id)
        {
            var messages = await messageRepository.GetConversationAsync(user1Id, user2Id);
            return messages.Select(MapToDto);
        }

        public async Task<ApiResponseDto<MessageDto>> CreateAsync(MessageDto messageDto)
        {
            var message = new Message
            {
                SenderId = messageDto.SenderId,
                ReceiverId = messageDto.ReceiverId,
                Content = messageDto.Content,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            int messageId = await messageRepository.CreateAsync(message);
            message.Id = messageId;

            // Retrieve the full message with navigation properties
            var createdMessage = await messageRepository.GetByIdAsync(messageId);
            if (createdMessage == null)
            {
                return ApiResponseDto<MessageDto>.ErrorResponse("Failed to retrieve created message");
            }

            var createdMessageDto = MapToDto(createdMessage);
            return ApiResponseDto<MessageDto>.SuccessResponse(createdMessageDto, "Message sent successfully");
        }

        public async Task<ApiResponseDto<bool>> DeleteAsync(int id)
        {
            var existingMessage = await messageRepository.GetByIdAsync(id);
            if (existingMessage == null)
            {
                return ApiResponseDto<bool>.ErrorResponse("Message not found");
            }

            bool success = await messageRepository.DeleteAsync(id);
            if (!success)
            {
                return ApiResponseDto<bool>.ErrorResponse("Failed to delete message");
            }

            return ApiResponseDto<bool>.SuccessResponse(true, "Message deleted successfully");
        }

        public async Task<ApiResponseDto<bool>> MarkAsReadAsync(int id)
        {
            var existingMessage = await messageRepository.GetByIdAsync(id);
            if (existingMessage == null)
            {
                return ApiResponseDto<bool>.ErrorResponse("Message not found");
            }

            bool success = await messageRepository.MarkAsReadAsync(id);
            if (!success)
            {
                return ApiResponseDto<bool>.ErrorResponse("Failed to mark message as read");
            }

            return ApiResponseDto<bool>.SuccessResponse(true, "Message marked as read successfully");
        }

        public async Task<ApiResponseDto<bool>> MarkAllAsReadAsync(int receiverId, int senderId)
        {
            bool success = await messageRepository.MarkAllAsReadAsync(receiverId, senderId);
            if (!success)
            {
                return ApiResponseDto<bool>.ErrorResponse("Failed to mark messages as read");
            }

            return ApiResponseDto<bool>.SuccessResponse(true, "All messages marked as read successfully");
        }

        private MessageDto MapToDto(Message message)
        {
            return new MessageDto
            {
                Id = message.Id,
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                Content = message.Content,
                IsRead = message.IsRead,
                CreatedAt = message.CreatedAt,
                SenderName = message.SenderName,
                ReceiverName = message.ReceiverName,
                SenderAvatar = message.SenderAvatar,
                ReceiverAvatar = message.ReceiverAvatar
            };
        }
    }
}
