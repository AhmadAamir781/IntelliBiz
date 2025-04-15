using IntelliBiz.API.Models;

namespace IntelliBiz.Repositories
{
    public interface IReviewRepository
    {
        Task<IEnumerable<Review>> GetReviewsByBusinessIdAsync(int businessId);
        Task<IEnumerable<Review>> GetReviewsByUserIdAsync(int userId);
        Task<Review?> GetReviewByIdAsync(int id);
        Task<Review?> GetReviewByUserAndBusinessAsync(int userId, int businessId);
        Task<int> CreateReviewAsync(Review review);
        Task<bool> UpdateReviewAsync(Review review);
        Task<bool> DeleteReviewAsync(int id);
    }
}