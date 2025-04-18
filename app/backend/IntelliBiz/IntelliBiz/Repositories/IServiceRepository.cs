using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories
{
    public interface IServiceRepository
    {
        Task<Service?> GetByIdAsync(int id);
        Task<IEnumerable<Service>> GetAllAsync();
        Task<IEnumerable<Service>> GetByBusinessIdAsync(int businessId);
        Task<int> CreateAsync(Service service);
        Task<bool> UpdateAsync(Service service);
        Task<bool> DeleteAsync(int id);
        Task<bool> ToggleActiveStatusAsync(int id);
    }
}
