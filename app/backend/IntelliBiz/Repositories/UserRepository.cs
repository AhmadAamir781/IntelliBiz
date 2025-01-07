
using Dapper;
using IntelliBiz.Models;
using IntelliBiz.Repositories.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;


namespace IntelliBiz.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;

        public UserRepository(IConfiguration configuration)
        {
            // Fetch the connection string from the appsettings.json or environment variables
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        private IDbConnection CreateConnection() => new SqlConnection(_connectionString);
        public async Task<int> CreateUserAsync(User user)
        {
            const string query = "EXEC [dbo].[CreateUser] @p_name, @p_email, @p_password, @p_phone, @p_address, @p_role";
            using var connection = CreateConnection();

            return await connection.ExecuteAsync(query, new
            {
                p_name = user.Name,
                p_email = user.Email,
                p_password = user.Password,
                p_phone = user.Phone,
                p_address = user.Address,
                p_role = user.Role
            });
        }

        public async Task<User> ReadUserAsync(int userId)
        {
            const string query = "EXEC [dbo].[ReadUser] @p_user_id";
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(query, new { p_user_id = userId });
        } 
        
        public async Task<User> ReadAllUserAsync()
        {
            const string query = "EXEC [dbo].[ReadUser] @p_user_id";
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(query, new { p_user_id = 0 });
        }

        public async Task<int> UpdateUserAsync(User user)
        {
            const string query = "EXEC [dbo].[UpdateUser] @p_user_id, @p_name, @p_email, @p_password, @p_phone, @p_address, @p_role";
            using var connection = CreateConnection();
            return await connection.ExecuteAsync(query, new
            {
                p_user_id = user.UserId,
                p_name = user.Name,
                p_email = user.Email,
                p_password = user.Password,
                p_phone = user.Phone,
                p_address = user.Address,
                p_role = user.Role
            });
        }

        public async Task<int> DeleteUserAsync(int userId)
        {
            const string query = "EXEC [dbo].[DeleteUser] @p_user_id";
            using var connection = CreateConnection();
            return await connection.ExecuteAsync(query, new { p_user_id = userId });
        }
    }

}
