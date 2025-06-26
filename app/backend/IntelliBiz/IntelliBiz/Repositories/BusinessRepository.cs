using Dapper;
using IntelliBiz.API.Data;
using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories
{
    public class BusinessRepository : IBusinessRepository
    {
        private readonly IDatabaseConnectionFactory _connectionFactory;

        public BusinessRepository(IDatabaseConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<Business?> GetByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT b.*, u.FirstName + ' ' + u.LastName as OwnerName
                FROM Businesses b
                JOIN Users u ON b.OwnerId = u.Id
                WHERE b.Id = @Id";
            return await connection.QueryFirstOrDefaultAsync<Business>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Business>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT b.*, u.FirstName + ' ' + u.LastName as OwnerName
                FROM Businesses b
                JOIN Users u ON b.OwnerId = u.Id
                ORDER BY b.CreatedAt DESC";
            return await connection.QueryAsync<Business>(sql);
        }

        public async Task<IEnumerable<Business>> GetByOwnerIdAsync(int ownerId)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT b.*, u.FirstName + ' ' + u.LastName as OwnerName
                FROM Businesses b
                JOIN Users u ON b.OwnerId = u.Id
                WHERE b.OwnerId = @OwnerId
                ORDER BY b.CreatedAt DESC";
            return await connection.QueryAsync<Business>(sql, new { OwnerId = ownerId });
        }

        public async Task<IEnumerable<Business>> GetByCategoryAsync(string category)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT b.*, u.FirstName + ' ' + u.LastName as OwnerName
                FROM Businesses b
                JOIN Users u ON b.OwnerId = u.Id
                WHERE b.Category = @Category
                ORDER BY b.CreatedAt DESC";
            return await connection.QueryAsync<Business>(sql, new { Category = category });
        }

        public async Task<IEnumerable<string>> GetCategoriesAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT Category FROM Businesses";
            return await connection.QueryAsync<string>(sql);
        }


        public async Task<IEnumerable<Business>> SearchAsync(string searchTerm, string? category = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            string sql;
            object parameters;

            if (string.IsNullOrEmpty(category))
            {
                sql = @"
                    SELECT b.*, u.FirstName + ' ' + u.LastName as OwnerName
                    FROM Businesses b
                    JOIN Users u ON b.OwnerId = u.Id
                    WHERE b.Name LIKE @SearchTerm OR b.Description LIKE @SearchTerm
                    ORDER BY b.CreatedAt DESC";
                parameters = new { SearchTerm = $"%{searchTerm}%" };
            }
            else
            {
                sql = @"
                    SELECT b.*, u.FirstName + ' ' + u.LastName as OwnerName
                    FROM Businesses b
                    JOIN Users u ON b.OwnerId = u.Id
                    WHERE (b.Name LIKE @SearchTerm OR b.Description LIKE @SearchTerm) AND b.Category = @Category
                    ORDER BY b.CreatedAt DESC";
                parameters = new { SearchTerm = $"%{searchTerm}%", Category = category };
            }

            return await connection.QueryAsync<Business>(sql, parameters);
        }

        public async Task<int> CreateAsync(Business business)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                INSERT INTO Businesses (OwnerId, Name, Category, Description, Address, City, State, ZipCode, Phone, Email, Website, IsVerified, CreatedAt)
                VALUES (@OwnerId, @Name, @Category, @Description, @Address, @City, @State, @ZipCode, @Phone, @Email, @Website, @IsVerified, @CreatedAt);
                SELECT CAST(SCOPE_IDENTITY() as int)";
            
            business.CreatedAt = DateTime.UtcNow;
            return await connection.QuerySingleAsync<int>(sql, business);
        }

        public async Task<bool> UpdateAsync(Business business)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                UPDATE Businesses
                SET Name = @Name,
                    Category = @Category,
                    Description = @Description,
                    Address = @Address,
                    City = @City,
                    State = @State,
                    ZipCode = @ZipCode,
                    Phone = @Phone,
                    Email = @Email,
                    Website = @Website,
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id";
            
            business.UpdatedAt = DateTime.UtcNow;
            int rowsAffected = await connection.ExecuteAsync(sql, business);
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = "DELETE FROM Services where BusinessId = @id; DELETE FROM Businesses WHERE Id = @Id;";
            int rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<bool> VerifyBusinessAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                UPDATE Businesses
                SET IsVerified = 1,
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id";
            
            int rowsAffected = await connection.ExecuteAsync(sql, new { Id = id, UpdatedAt = DateTime.UtcNow });
            return rowsAffected > 0;
        }
    }
}
