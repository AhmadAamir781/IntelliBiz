using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories
{
    public interface IReviewRepository
    {
        Task<Review?> GetByIdAsync(int id);
        Task<IEnumerable<Review>> GetAllAsync();
        Task<IEnumerable<Review>> GetByUserIdAsync(int userId);
        Task<IEnumerable<Review>> GetByBusinessIdAsync(int businessId);
        Task<IEnumerable<Review>> GetByStatusAsync(string status);
        Task<IEnumerable<Review>> GetFlaggedAsync();
        Task<int> CreateAsync(Review review);
        Task<bool> UpdateAsync(Review review);
        Task<bool> DeleteAsync(int id);
        Task<bool> FlagReviewAsync(int id, string flagReason);
        Task<bool> UnflagReviewAsync(int id);
        Task<bool> UpdateStatusAsync(int id, string status);
    }
}
