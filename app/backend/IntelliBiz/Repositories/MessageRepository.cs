namespace IntelliBiz.Repositories
{
    using Dapper;
    using Microsoft.Data.SqlClient;
    using Microsoft.Extensions.Configuration;
    using System.Data;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntelliBiz.Models;
    using IntelliBiz.Repositories.Interfaces;

    public class MessageRepository : IMessageRepository
    {
        private readonly string _connectionString;

        public MessageRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // Create Message
        public async Task<int> CreateMessageAsync(Message message)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_chat_id", message.ChatId);
                parameters.Add("@p_sender_id", message.SenderId);
                parameters.Add("@p_content", message.Content);

                return await connection.ExecuteAsync("dbo.CreateMessage", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        // Delete Message
        public async Task<int> DeleteMessageAsync(int messageId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_message_id", messageId);

                return await connection.ExecuteAsync("dbo.DeleteMessage", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        // Read Message
        public async Task<Message> ReadMessageAsync(int messageId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_message_id", messageId);

                return await connection.QuerySingleOrDefaultAsync<Message>("dbo.ReadMessage", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        // Update Message
        public async Task<int> UpdateMessageAsync(Message message)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_message_id", message.MessageId);
                parameters.Add("@p_content", message.Content);
                parameters.Add("@p_sent_at", message.SentAt);

                return await connection.ExecuteAsync("dbo.UpdateMessage", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        // Get All Messages for a Chat
        public async Task<IEnumerable<Message>> GetAllMessagesAsync(int chatId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_chat_id", chatId);

                return await connection.QueryAsync<Message>("dbo.GetAllMessages", parameters, commandType: CommandType.StoredProcedure);
            }
        }
    }

}
