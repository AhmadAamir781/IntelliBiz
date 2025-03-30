
using IntelliBiz.Models;

namespace IntelliBiz.Repositories.Interfaces;

public interface IBusinessRepository
{
    Task<IEnumerable<Business>> GetFeaturedBusinessesAsync(int count = 6);
    Task<Business?> GetBusinessDetailsAsync(int businessId);
    Task<Business> CreateBusinessAsync(CreateBusinessRequest request, int userId);
    Task<Business> UpdateBusinessAsync(int businessId, UpdateBusinessRequest request);
    Task<BusinessImage> AddBusinessImageAsync(int businessId, BusinessImageRequest request);
    Task<Review> AddBusinessReviewAsync(int businessId, int userId, CreateReviewRequest request);
    Task<IEnumerable<Business>> GetUserBusinessesAsync(int userId);
} 