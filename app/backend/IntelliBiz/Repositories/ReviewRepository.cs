namespace IntelliBiz.Repositories
{
    using Dapper;
    using IntelliBiz.Models;
    using IntelliBiz.Repositories.Interfaces;
    using Microsoft.Data.SqlClient;
    using Microsoft.Extensions.Configuration;
    using System.Data;
    using System.Threading.Tasks;

    public class ReviewRepository : IReviewRepository
    {
        private readonly string _connectionString;

        public ReviewRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // Create Review
        public async Task<int> CreateReviewAsync(Review review)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_user_id", review.UserId);
                parameters.Add("@p_business_id", review.BusinessId);
                parameters.Add("@p_rating", review.Rating);
                parameters.Add("@p_comment", review.Comment);
                parameters.Add("@p_created_at", review.CreatedAt);

                return await connection.ExecuteAsync("dbo.CreateReview", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        // Delete Review
        public async Task<int> DeleteReviewAsync(int reviewId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_review_id", reviewId);

                return await connection.ExecuteAsync("dbo.DeleteReview", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        // Read Review
        public async Task<Review> ReadReviewAsync(int reviewId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_review_id", reviewId);

                return await connection.QuerySingleOrDefaultAsync<Review>("dbo.ReadReview", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        // Update Review
        public async Task<int> UpdateReviewAsync(Review review)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_review_id", review.ReviewId);
                parameters.Add("@p_rating", review.Rating);
                parameters.Add("@p_comment", review.Comment);

                return await connection.ExecuteAsync("dbo.UpdateReview", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        // Get All Reviews for a Business
        public async Task<IEnumerable<Review>> GetAllReviewsAsync(int businessId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_business_id", businessId);

                return await connection.QueryAsync<Review>("dbo.GetAllReviews", parameters, commandType: CommandType.StoredProcedure);
            }
        }
    }

}
