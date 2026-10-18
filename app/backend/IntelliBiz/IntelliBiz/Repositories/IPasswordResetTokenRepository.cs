using IntelliBiz.Models;

namespace IntelliBiz.Repositories
{
    public interface IPasswordResetTokenRepository
    {
        Task AddAsync(PasswordResetToken token);
        Task<PasswordResetToken?> GetByTokenAsync(string token);
        Task DeleteExpiredAsync();
    }
} 