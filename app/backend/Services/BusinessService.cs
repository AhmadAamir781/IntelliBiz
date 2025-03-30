using IntelliBiz.API.Models;
using IntelliBiz.API.Repositories;

namespace IntelliBiz.API.Services;

public class BusinessService : IBusinessService
{
    private readonly IBusinessRepository _repository;

    public BusinessService(IBusinessRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Business>> GetAllBusinessesAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Business?> GetBusinessByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<Business> CreateBusinessAsync(CreateBusinessRequest business)
    {
        var id = await _repository.CreateAsync(business);
        var createdBusiness = await _repository.GetByIdAsync(id);
        
        if (createdBusiness == null)
        {
            throw new InvalidOperationException("Failed to create business");
        }

        return createdBusiness;
    }

    public async Task<bool> UpdateBusinessAsync(int id, UpdateBusinessRequest business)
    {
        return await _repository.UpdateAsync(id, business);
    }

    public async Task<bool> DeleteBusinessAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }
} 