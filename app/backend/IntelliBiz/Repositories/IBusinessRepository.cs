using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories
{
    public interface IBusinessRepository
    {
        Task<Business?> GetByIdAsync(int id);
        Task<IEnumerable<Business>> GetAllAsync();
        Task<IEnumerable<Business>> GetByOwnerIdAsync(int ownerId);
        Task<IEnumerable<Business>> GetByCategoryAsync(string category);
        Task<IEnumerable<Business>> SearchAsync(string searchTerm, string? category = null);
        Task<int> CreateAsync(Business business);
        Task<bool> UpdateAsync(Business business);
        Task<bool> DeleteAsync(int id);
        Task<bool> VerifyBusinessAsync(int id);
    }
}
