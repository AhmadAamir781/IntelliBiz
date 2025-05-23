using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task<IEnumerable<User>> GetAllAsync();
        Task<IEnumerable<User>> GetByRoleAsync(string role);
        Task<int> CreateAsync(User user);
        Task<bool> UpdateAsync(User user);
        Task<bool> DeleteAsync(int id);
        Task<bool> EmailExistsAsync(string email);
    }
}
