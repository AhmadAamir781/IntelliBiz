using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories;

public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetAllAsync();
} 