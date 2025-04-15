using Dapper;
using IntelliBiz.API.Data;
using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly IDatabaseConnectionFactory _connectionFactory;

        public ReviewRepository(IDatabaseConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<Review?> GetByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT r.*, 
                       u.FirstName + ' ' + u.LastName as UserName,
                       b.Name as BusinessName
                FROM Reviews r
                JOIN Users u ON r.UserId = u.Id
                JOIN Businesses b ON r.BusinessId = b.Id
                WHERE r.Id = @Id";
            return await connection.QueryFirstOrDefaultAsync<Review>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Review>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT r.*, 
                       u.FirstName + ' ' + u.LastName as UserName,
                       b.Name as BusinessName
                FROM Reviews r
                JOIN Users u ON r.UserId = u.Id
                JOIN Businesses b ON r.BusinessId = b.Id
                ORDER BY r.CreatedAt DESC";
            return await connection.QueryAsync<Review>(sql);
        }

        public async Task<IEnumerable<Review>> GetByUserIdAsync(int userId)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT r.*, 
                       u.FirstName + ' ' + u.LastName as UserName,
                       b.Name as BusinessName
                FROM Reviews r
                JOIN Users u ON r.UserId = u.Id
                JOIN Businesses b ON r.BusinessId = b.Id
                WHERE r.UserId = @UserId
                ORDER BY r.CreatedAt DESC";
            return await connection.QueryAsync<Review>(sql, new { UserId = userId });
        }

        public async Task<IEnumerable<Review>> GetByBusinessIdAsync(int businessId)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT r.*, 
                       u.FirstName + ' ' + u.LastName as UserName,
                       b.Name as BusinessName
                FROM Reviews r
                JOIN Users u ON r.UserId = u.Id
                JOIN Businesses b ON r.BusinessId = b.Id
                WHERE r.BusinessId = @BusinessId
                ORDER BY r.CreatedAt DESC";
            return await connection.QueryAsync<Review>(sql, new { BusinessId = businessId });
        }

        public async Task<IEnumerable<Review>> GetByStatusAsync(string status)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT r.*, 
                       u.FirstName + ' ' + u.LastName as UserName,
                       b.Name as BusinessName
                FROM Reviews r
                JOIN Users u ON r.UserId = u.Id
                JOIN Businesses b ON r.BusinessId = b.Id
                WHERE r.Status = @Status
                ORDER BY r.CreatedAt DESC";
            return await connection.QueryAsync<Review>(sql, new { Status = status });
        }

        public async Task<IEnumerable<Review>> GetFlaggedAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT r.*, 
                       u.FirstName + ' ' + u.LastName as UserName,
                       b.Name as BusinessName
                FROM Reviews r
                JOIN Users u ON r.UserId = u.Id
                JOIN Businesses b ON r.BusinessId = b.Id
                WHERE r.IsFlagged = 1
                ORDER BY r.CreatedAt DESC";
            return await connection.QueryAsync<Review>(sql);
        }

        public async Task<int> CreateAsync(Review review)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                INSERT INTO Reviews (UserId, BusinessId, Rating, Comment, IsFlagged, Status, CreatedAt)
                VALUES (@UserId, @BusinessId, @Rating, @Comment, @IsFlagged, @Status, @CreatedAt);
                SELECT CAST(SCOPE_IDENTITY() as int)";
            
            review.CreatedAt = DateTime.UtcNow;
            return await connection.QuerySingleAsync<int>(sql, review);
        }

        public async Task<bool> UpdateAsync(Review review)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                UPDATE Reviews
                SET Rating = @Rating,
                    Comment = @Comment,
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id";
            
            review.UpdatedAt = DateTime.UtcNow;
            int rowsAffected = await connection.ExecuteAsync(sql, review);
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = "DELETE FROM Reviews WHERE Id = @Id";
            int rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<bool> FlagReviewAsync(int id, string flagReason)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                UPDATE Reviews
                SET IsFlagged = 1,
                    FlagReason = @FlagReason,
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id";
            
            int rowsAffected = await connection.ExecuteAsync(sql, new { Id = id, FlagReason = flagReason, UpdatedAt = DateTime.UtcNow });
            return rowsAffected > 0;
        }

        public async Task<bool> UnflagReviewAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                UPDATE Reviews
                SET IsFlagged = 0,
                    FlagReason = NULL,
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id";
            
            int rowsAffected = await connection.ExecuteAsync(sql, new { Id = id, UpdatedAt = DateTime.UtcNow });
            return rowsAffected > 0;
        }

        public async Task<bool> UpdateStatusAsync(int id, string status)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                UPDATE Reviews
                SET Status = @Status,
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id";
            
            int rowsAffected = await connection.ExecuteAsync(sql, new { Id = id, Status = status, UpdatedAt = DateTime.UtcNow });
            return rowsAffected > 0;
        }
    }
}
