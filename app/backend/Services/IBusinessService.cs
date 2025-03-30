using IntelliBiz.API.Models;

namespace IntelliBiz.API.Services;

public interface IBusinessService
{
    Task<IEnumerable<Business>> GetAllBusinessesAsync();
    Task<Business?> GetBusinessByIdAsync(int id);
    Task<Business> CreateBusinessAsync(CreateBusinessRequest business);
    Task<bool> UpdateBusinessAsync(int id, UpdateBusinessRequest business);
    Task<bool> DeleteBusinessAsync(int id);
} 