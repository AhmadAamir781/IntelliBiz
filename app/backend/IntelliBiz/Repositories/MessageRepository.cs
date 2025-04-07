using Dapper;
using IntelliBiz.API.Models;
using IntelliBiz.Database;

namespace IntelliBiz.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DapperContext _context;

        public MessageRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Message>> GetMessagesByConversationIdAsync(int conversationId)
        {
            var query = @"
                SELECT m.*, u.Username, u.FirstName, u.LastName
                FROM Messages m
                JOIN Users u ON m.SenderId = u.Id
                WHERE m.ConversationId = @ConversationId
                ORDER BY m.CreatedAt";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<Message>(query, new { ConversationId = conversationId });
        }

        public async Task<IEnumerable<Conversation>> GetUserConversationsAsync(int userId)
        {
            var query = @"
                SELECT c.*, b.Name as BusinessName, b.LogoUrl as BusinessLogoUrl,
                       (SELECT COUNT(*) FROM Messages m WHERE m.ConversationId = c.Id AND m.IsRead = 0 AND m.SenderId != @UserId) as UnreadCount,
                       (SELECT TOP 1 m.Content FROM Messages m WHERE m.ConversationId = c.Id ORDER BY m.CreatedAt DESC) as LastMessage,
                       (SELECT TOP 1 m.CreatedAt FROM Messages m WHERE m.ConversationId = c.Id ORDER BY m.CreatedAt DESC) as LastMessageDate
                FROM Conversations c
                JOIN Businesses b ON c.BusinessId = b.Id
                WHERE c.UserId = @UserId
                ORDER BY LastMessageDate DESC";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<Conversation>(query, new { UserId = userId });
        }

        public async Task<IEnumerable<Conversation>> GetBusinessConversationsAsync(int businessId)
        {
            var query = @"
                SELECT c.*, u.Username, u.FirstName, u.LastName,
                       (SELECT COUNT(*) FROM Messages m WHERE m.ConversationId = c.Id AND m.IsRead = 0 AND m.SenderId != b.OwnerId) as UnreadCount,
                       (SELECT TOP 1 m.Content FROM Messages m WHERE m.ConversationId = c.Id ORDER BY m.CreatedAt DESC) as LastMessage,
                       (SELECT TOP 1 m.CreatedAt FROM Messages m WHERE m.ConversationId = c.Id ORDER BY m.CreatedAt DESC) as LastMessageDate
                FROM Conversations c
                JOIN Users u ON c.UserId = u.Id
                JOIN Businesses b ON c.BusinessId = b.Id
                WHERE c.BusinessId = @BusinessId
                ORDER BY LastMessageDate DESC";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<Conversation>(query, new { BusinessId = businessId });
        }

        public async Task<Conversation?> GetConversationByIdAsync(int id)
        {
            var query = @"
                SELECT c.*, u.Username as UserUsername, u.FirstName as UserFirstName, u.LastName as UserLastName,
                       b.Name as BusinessName, b.LogoUrl as BusinessLogoUrl
                FROM Conversations c
                JOIN Users u ON c.UserId = u.Id
                JOIN Businesses b ON c.BusinessId = b.Id
                WHERE c.Id = @Id";

            using var connection = _context.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<Conversation>(query, new { Id = id });
        }

        public async Task<Conversation?> GetConversationByUserAndBusinessAsync(int userId, int businessId)
        {
            var query = @"
                SELECT c.*, u.Username as UserUsername, u.FirstName as UserFirstName, u.LastName as UserLastName,
                       b.Name as BusinessName, b.LogoUrl as BusinessLogoUrl
                FROM Conversations c
                JOIN Users u ON c.UserId = u.Id
                JOIN Businesses b ON c.BusinessId = b.Id
                WHERE c.UserId = @UserId AND c.BusinessId = @BusinessId";

            using var connection = _context.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<Conversation>(query,
                new { UserId = userId, BusinessId = businessId });
        }

        public async Task<int> CreateConversationAsync(Conversation conversation)
        {
            var query = @"
                INSERT INTO Conversations (UserId, BusinessId, CreatedAt) 
                OUTPUT INSERTED.Id
                VALUES (@UserId, @BusinessId, @CreatedAt)";

            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(query, conversation);
        }

        public async Task<int> CreateMessageAsync(Message message)
        {
            var query = @"
                INSERT INTO Messages (ConversationId, SenderId, Content, IsRead, CreatedAt) 
                OUTPUT INSERTED.Id
                VALUES (@ConversationId, @SenderId, @Content, @IsRead, @CreatedAt)";

            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(query, message);
        }

        public async Task<bool> MarkConversationAsReadAsync(int conversationId, int userId)
        {
            var query = @"
                UPDATE Messages 
                SET IsRead = 1
                WHERE ConversationId = @ConversationId AND SenderId != @UserId AND IsRead = 0";

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query,
                new { ConversationId = conversationId, UserId = userId });
            return affectedRows > 0;
        }

        public async Task<int> GetUnreadMessageCountAsync(int conversationId, int userId)
        {
            var query = @"
                SELECT COUNT(*) 
                FROM Messages 
                WHERE ConversationId = @ConversationId AND SenderId != @UserId AND IsRead = 0";

            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(query,
                new { ConversationId = conversationId, UserId = userId });
        }

        public async Task<int> GetTotalUnreadMessageCountAsync(int userId)
        {
            var query = @"
                SELECT COUNT(*) 
                FROM Messages m
                JOIN Conversations c ON m.ConversationId = c.Id
                WHERE (c.UserId = @UserId OR c.BusinessId IN (SELECT Id FROM Businesses WHERE OwnerId = @UserId))
                  AND m.SenderId != @UserId 
                  AND m.IsRead = 0";

            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(query, new { UserId = userId });
        }
    }
}