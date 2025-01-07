using IntelliBiz.Models;

namespace IntelliBiz.Repositories.Interfaces
{
    public interface IBusinessRepository
    {
        Task<int> CreateBusinessAsync(Business business);
        Task<int> DeleteBusinessAsync(int businessId);
        Task<IEnumerable<Business>> GetAllBusinessesAsync();
        Task<Business> ReadBusinessAsync(int businessId);
        Task<int> UpdateBusinessAsync(Business business);
    }
}