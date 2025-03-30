using System.Data;
using Dapper;
using IntelliBiz.Models;
using IntelliBiz.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace IntelliBiz.Repositories;

public class ChatRepository : IChatRepository
{
    private readonly IDbConnection _db;

    public ChatRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<ChatRoom> CreateChatRoomAsync(int businessId, int userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@BusinessId", businessId);
        parameters.Add("@UserId", userId);
        parameters.Add("@ChatRoomId", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await _db.ExecuteAsync("CreateChatRoom", parameters, commandType: CommandType.StoredProcedure);

        var chatRoomId = parameters.Get<int>("@ChatRoomId");
        return await GetChatRoomByIdAsync(chatRoomId) 
            ?? throw new InvalidOperationException("Failed to create chat room");
    }

    public async Task<IEnumerable<ChatRoomResponse>> GetUserChatRoomsAsync(int userId)
    {
        var parameters = new { UserId = userId };
        return await _db.QueryAsync<ChatRoomResponse>("GetChatRooms", parameters, commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<ChatMessageResponse>> GetChatMessagesAsync(int chatRoomId, int? lastMessageId = null)
    {
        var parameters = new
        {
            ChatRoomId = chatRoomId,
            LastMessageId = lastMessageId
        };

        return await _db.QueryAsync<ChatMessageResponse>("GetChatMessages", parameters, commandType: CommandType.StoredProcedure);
    }

    public async Task<ChatMessage> SaveChatMessageAsync(int chatRoomId, int senderId, CreateChatMessageRequest request)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@ChatRoomId", chatRoomId);
        parameters.Add("@SenderId", senderId);
        parameters.Add("@Message", request.Message);
        parameters.Add("@MessageId", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await _db.ExecuteAsync("SaveChatMessage", parameters, commandType: CommandType.StoredProcedure);

        var messageId = parameters.Get<int>("@MessageId");
        return await GetChatMessageByIdAsync(messageId) 
            ?? throw new InvalidOperationException("Failed to save chat message");
    }

    private async Task<ChatRoom?> GetChatRoomByIdAsync(int chatRoomId)
    {
        var parameters = new { ChatRoomId = chatRoomId };
        return await _db.QueryFirstOrDefaultAsync<ChatRoom>("GetChatRoomById", parameters, commandType: CommandType.StoredProcedure);
    }

    private async Task<ChatMessage?> GetChatMessageByIdAsync(int messageId)
    {
        var parameters = new { MessageId = messageId };
        return await _db.QueryFirstOrDefaultAsync<ChatMessage>("GetChatMessageById", parameters, commandType: CommandType.StoredProcedure);
    }
} 