using System.Threading.Tasks;
using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories
{
    public interface IPasswordResetTokenRepository
    {
        Task AddAsync(PasswordResetToken token);
        Task<PasswordResetToken?> GetByTokenAsync(string token);
        Task DeleteExpiredAsync();
    }
} 