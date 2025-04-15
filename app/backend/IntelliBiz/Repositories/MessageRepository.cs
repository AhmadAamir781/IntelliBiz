using Dapper;
using IntelliBiz.API.Data;
using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly IDatabaseConnectionFactory _connectionFactory;

        public MessageRepository(IDatabaseConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<Message?> GetByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT m.*,
                       s.FirstName + ' ' + s.LastName as SenderName,
                       r.FirstName + ' ' + r.LastName as ReceiverName
                FROM Messages m
                JOIN Users s ON m.SenderId = s.Id
                JOIN Users r ON m.ReceiverId = r.Id
                WHERE m.Id = @Id";
            return await connection.QueryFirstOrDefaultAsync<Message>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Message>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT m.*,
                       s.FirstName + ' ' + s.LastName as SenderName,
                       r.FirstName + ' ' + r.LastName as ReceiverName
                FROM Messages m
                JOIN Users s ON m.SenderId = s.Id
                JOIN Users r ON m.ReceiverId = r.Id
                ORDER BY m.CreatedAt DESC";
            return await connection.QueryAsync<Message>(sql);
        }

        public async Task<IEnumerable<Message>> GetBySenderIdAsync(int senderId)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT m.*,
                       s.FirstName + ' ' + s.LastName as SenderName,
                       r.FirstName + ' ' + r.LastName as ReceiverName
                FROM Messages m
                JOIN Users s ON m.SenderId = s.Id
                JOIN Users r ON m.ReceiverId = r.Id
                WHERE m.SenderId = @SenderId
                ORDER BY m.CreatedAt DESC";
            return await connection.QueryAsync<Message>(sql, new { SenderId = senderId });
        }

        public async Task<IEnumerable<Message>> GetByReceiverIdAsync(int receiverId)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT m.*,
                       s.FirstName + ' ' + s.LastName as SenderName,
                       r.FirstName + ' ' + r.LastName as ReceiverName
                FROM Messages m
                JOIN Users s ON m.SenderId = s.Id
                JOIN Users r ON m.ReceiverId = r.Id
                WHERE m.ReceiverId = @ReceiverId
                ORDER BY m.CreatedAt DESC";
            return await connection.QueryAsync<Message>(sql, new { ReceiverId = receiverId });
        }

        public async Task<IEnumerable<Message>> GetConversationAsync(int user1Id, int user2Id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT m.*,
                       s.FirstName + ' ' + s.LastName as SenderName,
                       r.FirstName + ' ' + r.LastName as ReceiverName
                FROM Messages m
                JOIN Users s ON m.SenderId = s.Id
                JOIN Users r ON m.ReceiverId = r.Id
                WHERE (m.SenderId = @User1Id AND m.ReceiverId = @User2Id)
                   OR (m.SenderId = @User2Id AND m.ReceiverId = @User1Id)
                ORDER BY m.CreatedAt ASC";
            return await connection.QueryAsync<Message>(sql, new { User1Id = user1Id, User2Id = user2Id });
        }

        public async Task<int> CreateAsync(Message message)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                INSERT INTO Messages (SenderId, ReceiverId, Content, IsRead, CreatedAt)
                VALUES (@SenderId, @ReceiverId, @Content, @IsRead, @CreatedAt);
                SELECT CAST(SCOPE_IDENTITY() as int)";
            
            message.CreatedAt = DateTime.UtcNow;
            return await connection.QuerySingleAsync<int>(sql, message);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = "DELETE FROM Messages WHERE Id = @Id";
            int rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<bool> MarkAsReadAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                UPDATE Messages
                SET IsRead = 1
                WHERE Id = @Id";
            
            int rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<bool> MarkAllAsReadAsync(int receiverId, int senderId)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                UPDATE Messages
                SET IsRead = 1
                WHERE ReceiverId = @ReceiverId AND SenderId = @SenderId AND IsRead = 0";
            
            int rowsAffected = await connection.ExecuteAsync(sql, new { ReceiverId = receiverId, SenderId = senderId });
            return rowsAffected > 0;
        }
    }
}
