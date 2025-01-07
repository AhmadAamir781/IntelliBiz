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

    public class ChatRepository : IChatRepository
    {
        private readonly string _connectionString;

        public ChatRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // Create Chat
        public async Task<int> CreateChatAsync(Chat chat)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_user_id", chat.UserId);
                parameters.Add("@p_business_id", chat.BusinessId);
                parameters.Add("@p_initiated_at", chat.InitiatedAt);

                return await connection.ExecuteAsync("dbo.CreateChat", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        // Delete Chat
        public async Task<int> DeleteChatAsync(int chatId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_chat_id", chatId);

                return await connection.ExecuteAsync("dbo.DeleteChat", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        // Read Chat
        public async Task<Chat> ReadChatAsync(int chatId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_chat_id", chatId);

                return await connection.QuerySingleOrDefaultAsync<Chat>("dbo.ReadChat", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        // Update Chat
        public async Task<int> UpdateChatAsync(Chat chat)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_chat_id", chat.ChatId);
                parameters.Add("@p_initiated_at", chat.InitiatedAt);

                return await connection.ExecuteAsync("dbo.UpdateChat", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        // Get All Chats for a Business
        public async Task<IEnumerable<Chat>> GetAllChatsAsync(int businessId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_business_id", businessId);

                return await connection.QueryAsync<Chat>("dbo.GetAllChats", parameters, commandType: CommandType.StoredProcedure);
            }
        }
    }

}
