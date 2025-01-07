using IntelliBiz.Models;

namespace IntelliBiz.Repositories.Interfaces
{
    public interface IReviewRepository
    {
        Task<int> CreateReviewAsync(Review review);
        Task<int> DeleteReviewAsync(int reviewId);
        Task<IEnumerable<Review>> GetAllReviewsAsync(int businessId);
        Task<Review> ReadReviewAsync(int reviewId);
        Task<int> UpdateReviewAsync(Review review);
    }
}