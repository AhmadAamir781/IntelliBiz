
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

        // Create User
        public async Task<int> CreateUserAsync(User user)
        {
            const string query = "EXEC [dbo].[CreateUser] @p_name, @p_email, @p_password, @p_phone, @p_address, @p_role";
            using var connection = CreateConnection();

            var parameters = new DynamicParameters();
            parameters.Add("@p_name", user.Name);
            parameters.Add("@p_email", user.Email);
            parameters.Add("@p_password", user.Password);
            parameters.Add("@p_phone", user.Phone);
            parameters.Add("@p_address", user.Address);
            parameters.Add("@p_role", user.Role);

            return await connection.ExecuteAsync(query, parameters, commandType: CommandType.StoredProcedure);
        }

        // Read User
        public async Task<User> ReadUserAsync(int userId)
        {
            const string query = "EXEC [dbo].[ReadUser] @p_user_id";
            using var connection = CreateConnection();

            var parameters = new DynamicParameters();
            parameters.Add("@p_user_id", userId);

            return await connection.QueryFirstOrDefaultAsync<User>(query, parameters, commandType: CommandType.StoredProcedure);
        }

        // Read All Users (or Use Case-appropriate Query for All Users)
        public async Task<IEnumerable<User>> ReadAllUsersAsync()
        {
            const string query = "Select * from [USER]";
            using var connection = CreateConnection();

            return await connection.QueryAsync<User>(query, commandType: CommandType.StoredProcedure);
        }

        // Update User
        public async Task<int> UpdateUserAsync(User user)
        {
            const string query = "EXEC [dbo].[UpdateUser] @p_user_id, @p_name, @p_email, @p_password, @p_phone, @p_address, @p_role";
            using var connection = CreateConnection();

            var parameters = new DynamicParameters();
            parameters.Add("@p_user_id", user.UserId);
            parameters.Add("@p_name", user.Name);
            parameters.Add("@p_email", user.Email);
            parameters.Add("@p_password", user.Password);
            parameters.Add("@p_phone", user.Phone);
            parameters.Add("@p_address", user.Address);
            parameters.Add("@p_role", user.Role);

            return await connection.ExecuteAsync(query, parameters, commandType: CommandType.StoredProcedure);
        }

        // Delete User
        public async Task<int> DeleteUserAsync(int userId)
        {
            const string query = "EXEC [dbo].[DeleteUser] @p_user_id";
            using var connection = CreateConnection();

            var parameters = new DynamicParameters();
            parameters.Add("@p_user_id", userId);

            return await connection.ExecuteAsync(query, parameters, commandType: CommandType.StoredProcedure);
        }
    }


}
