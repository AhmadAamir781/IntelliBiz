using Dapper;
using IntelliBiz.API.Models;
using IntelliBiz.Database;

namespace IntelliBiz.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DapperContext _context;

        public UserRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            var query = "SELECT * FROM Users WHERE Id = @Id";

            using var connection = _context.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<User>(query, new { Id = id });
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            var query = "SELECT * FROM Users WHERE Email = @Email";

            using var connection = _context.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<User>(query, new { Email = email });
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            var query = "SELECT * FROM Users WHERE Username = @Username";

            using var connection = _context.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<User>(query, new { Username = username });
        }

        public async Task<int> CreateUserAsync(User user)
        {
            var query = @"
                INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, PhoneNumber, Role, CreatedAt)
                OUTPUT INSERTED.Id
                VALUES (@Username, @Email, @PasswordHash, @FirstName, @LastName, @PhoneNumber, @Role, @CreatedAt)";

            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(query, user);
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            var query = @"
                UPDATE Users 
                SET Username = @Username, 
                    Email = @Email, 
                    FirstName = @FirstName, 
                    LastName = @LastName, 
                    PhoneNumber = @PhoneNumber, 
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id";

            user.UpdatedAt = DateTime.UtcNow;

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query, user);
            return affectedRows > 0;
        }

        public async Task<bool> UpdateUserRoleAsync(int id, string role)
        {
            var query = "UPDATE Users SET Role = @Role, UpdatedAt = @UpdatedAt WHERE Id = @Id";

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query,
                new { Id = id, Role = role, UpdatedAt = DateTime.UtcNow });
            return affectedRows > 0;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var query = "DELETE FROM Users WHERE Id = @Id";

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query, new { Id = id });
            return affectedRows > 0;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            var query = "SELECT * FROM Users ORDER BY CreatedAt DESC";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<User>(query);
        }

        public async Task<bool> ChangePasswordAsync(int userId, string newPasswordHash)
        {
            var query = "UPDATE Users SET PasswordHash = @PasswordHash, UpdatedAt = @UpdatedAt WHERE Id = @Id";

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query,
                new { Id = userId, PasswordHash = newPasswordHash, UpdatedAt = DateTime.UtcNow });
            return affectedRows > 0;
        }
    }
}