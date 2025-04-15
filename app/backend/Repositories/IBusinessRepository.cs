using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories;

public interface IBusinessRepository
{
    Task<IEnumerable<Business>> GetAllAsync(BusinessSearchRequest? searchRequest = null);
    Task<Business?> GetByIdAsync(int id);
    Task<int> CreateAsync(CreateBusinessRequest business);
    Task<bool> UpdateAsync(int id, UpdateBusinessRequest business);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<Business>> GetFeaturedBusinessesAsync(int count = 6);
} 