using Dapper;
using IntelliBiz.API.Models;
using IntelliBiz.Database;

namespace IntelliBiz.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly DapperContext _context;
        private readonly IBusinessRepository _businessRepository;

        public ReviewRepository(DapperContext context, IBusinessRepository businessRepository)
        {
            _context = context;
            _businessRepository = businessRepository;
        }

        public async Task<IEnumerable<Review>> GetReviewsByBusinessIdAsync(int businessId)
        {
            var query = @"
                SELECT r.*, u.Username, u.FirstName, u.LastName 
                FROM Reviews r
                JOIN Users u ON r.UserId = u.Id
                WHERE r.BusinessId = @BusinessId
                ORDER BY r.CreatedAt DESC";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<Review>(query, new { BusinessId = businessId });
        }

        public async Task<IEnumerable<Review>> GetReviewsByUserIdAsync(int userId)
        {
            var query = @"
                SELECT r.*, b.Name as BusinessName
                FROM Reviews r
                JOIN Businesses b ON r.BusinessId = b.Id
                WHERE r.UserId = @UserId
                ORDER BY r.CreatedAt DESC";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<Review>(query, new { UserId = userId });
        }

        public async Task<Review?> GetReviewByIdAsync(int id)
        {
            var query = @"
                SELECT r.*, u.Username, u.FirstName, u.LastName 
                FROM Reviews r
                JOIN Users u ON r.UserId = u.Id
                WHERE r.Id = @Id";

            using var connection = _context.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<Review>(query, new { Id = id });
        }

        public async Task<Review?> GetReviewByUserAndBusinessAsync(int userId, int businessId)
        {
            var query = @"
                SELECT r.*, u.Username, u.FirstName, u.LastName 
                FROM Reviews r
                JOIN Users u ON r.UserId = u.Id
                WHERE r.UserId = @UserId AND r.BusinessId = @BusinessId";

            using var connection = _context.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<Review>(query, new { UserId = userId, BusinessId = businessId });
        }

        public async Task<int> CreateReviewAsync(Review review)
        {
            var query = @"
                INSERT INTO Reviews (BusinessId, UserId, Rating, Comment, CreatedAt) 
                OUTPUT INSERTED.Id
                VALUES (@BusinessId, @UserId, @Rating, @Comment, @CreatedAt)";

            using var connection = _context.CreateConnection();
            var id = await connection.ExecuteScalarAsync<int>(query, review);

            // Update business average rating
            await _businessRepository.UpdateBusinessRatingAsync(review.BusinessId);

            return id;
        }

        public async Task<bool> UpdateReviewAsync(Review review)
        {
            var query = @"
                UPDATE Reviews 
                SET Rating = @Rating, 
                    Comment = @Comment, 
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id AND UserId = @UserId";

            review.UpdatedAt = DateTime.UtcNow;

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query, review);

            if (affectedRows > 0)
            {
                // Update business average rating
                await _businessRepository.UpdateBusinessRatingAsync(review.BusinessId);
                return true;
            }

            return false;
        }

        public async Task<bool> DeleteReviewAsync(int id)
        {
            // First get the review to know which business to update
            var getQuery = "SELECT BusinessId FROM Reviews WHERE Id = @Id";

            using var connection = _context.CreateConnection();
            var businessId = await connection.ExecuteScalarAsync<int>(getQuery, new { Id = id });

            // Delete the review
            var deleteQuery = "DELETE FROM Reviews WHERE Id = @Id";
            var affectedRows = await connection.ExecuteAsync(deleteQuery, new { Id = id });

            if (affectedRows > 0)
            {
                // Update business average rating
                await _businessRepository.UpdateBusinessRatingAsync(businessId);
                return true;
            }

            return false;
        }
    }
}