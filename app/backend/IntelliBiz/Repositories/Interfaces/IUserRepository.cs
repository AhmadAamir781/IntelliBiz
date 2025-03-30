using IntelliBiz.Models;

namespace IntelliBiz.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetUserByAuth0IdAsync(string auth0Id);
    Task<User> GetUserByEmailAsync(string email);
    Task<User> CreateUserAsync(CreateUserRequest request);
    Task<User> UpdateUserAsync(int userId, UpdateUserRequest request);
    Task<IEnumerable<Business>> GetUserBusinessesAsync(int userId);
    Task<IEnumerable<Review>> GetUserReviewsAsync(int userId);
} 