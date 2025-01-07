using IntelliBiz.Models;

namespace IntelliBiz.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<int> CreateUserAsync(User user);
        Task<int> DeleteUserAsync(int userId);
        Task<User> ReadUserAsync(int userId);
        Task<IEnumerable<User>> ReadAllUsersAsync();
        Task<int> UpdateUserAsync(User user);
    }
}