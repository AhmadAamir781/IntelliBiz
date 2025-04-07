using IntelliBiz.API.Models;

namespace IntelliBiz.Repositories
{
    public interface IBusinessRepository
    {
        // Business CRUD
        Task<PagedResult<Business>> GetBusinessesAsync(BusinessQueryParameters parameters);
        Task<Business?> GetBusinessByIdAsync(int id);
        Task<IEnumerable<Business>> GetBusinessesByOwnerIdAsync(int ownerId);
        Task<int> CreateBusinessAsync(Business business);
        Task<bool> UpdateBusinessAsync(Business business);
        Task<bool> DeleteBusinessAsync(int id);
        Task<bool> VerifyBusinessAsync(int id, bool isVerified);
        Task<IEnumerable<string>> GetCategoriesAsync();
        Task<IEnumerable<string>> GetCitiesAsync();
        Task<IEnumerable<string>> GetStatesAsync();

        // Business Hours
        Task<IEnumerable<BusinessHour>> GetBusinessHoursAsync(int businessId);
        Task<int> CreateBusinessHourAsync(BusinessHour businessHour);
        Task<bool> UpdateBusinessHourAsync(BusinessHour businessHour);
        Task<bool> DeleteBusinessHoursAsync(int businessId);

        // Business Services
        Task<IEnumerable<BusinessService>> GetBusinessServicesAsync(int businessId);
        Task<BusinessService?> GetBusinessServiceByIdAsync(int id);
        Task<int> CreateBusinessServiceAsync(BusinessService service);
        Task<bool> UpdateBusinessServiceAsync(BusinessService service);
        Task<bool> DeleteBusinessServiceAsync(int id);

        // Business Images
        Task<IEnumerable<string>> GetBusinessImagesAsync(int businessId);
        Task<bool> AddBusinessImageAsync(int businessId, string imageUrl);
        Task<bool> DeleteBusinessImageAsync(int businessId, string imageUrl);

        // Reviews
        Task<IEnumerable<Review>> GetBusinessReviewsAsync(int businessId);
        Task<Review?> GetReviewByIdAsync(int id);
        Task<int> CreateReviewAsync(Review review);
        Task<bool> UpdateReviewAsync(Review review);
        Task<bool> DeleteReviewAsync(int id);
        Task<bool> UpdateBusinessRatingAsync(int businessId);
    }
}