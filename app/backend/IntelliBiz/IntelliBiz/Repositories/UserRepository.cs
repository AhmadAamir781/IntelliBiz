using Dapper;
using IntelliBiz.API.Data;
using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IDatabaseConnectionFactory _connectionFactory;

        public UserRepository(IDatabaseConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = "SELECT * FROM Users WHERE Id = @Id";
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { Id = id });
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = "SELECT * FROM Users WHERE Email = @Email";
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { Email = email });
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = "SELECT * FROM Users ORDER BY CreatedAt DESC";
            return await connection.QueryAsync<User>(sql);
        }

        public async Task<IEnumerable<User>> GetByRoleAsync(string role)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = "SELECT * FROM Users WHERE Role = @Role ORDER BY CreatedAt DESC";
            return await connection.QueryAsync<User>(sql, new { Role = role });
        }

        public async Task<int> CreateAsync(User user)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                INSERT INTO Users (FirstName, LastName, Email, PasswordHash, Role, CreatedAt)
                VALUES (@FirstName, @LastName, @Email, @PasswordHash, @Role, @CreatedAt);
                SELECT CAST(SCOPE_IDENTITY() as int)";
            
            user.CreatedAt = DateTime.UtcNow;
            return await connection.QuerySingleAsync<int>(sql, user);
        }

        public async Task<bool> UpdateAsync(User user)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                UPDATE Users
                SET FirstName = @FirstName,
                    LastName = @LastName,
                    Email = @Email,
                    Role = @Role,
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id";
            
            user.UpdatedAt = DateTime.UtcNow;
            int rowsAffected = await connection.ExecuteAsync(sql, user);
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = "DELETE FROM Reviews WHERE UserId = @Id; DELETE FROM Businesses WHERE OwnerId = @Id; DELETE FROM Users WHERE Id = @Id;";
            int rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = "SELECT COUNT(1) FROM Users WHERE Email = @Email";
            int count = await connection.ExecuteScalarAsync<int>(sql, new { Email = email });
            return count > 0;
        }
    }
}
