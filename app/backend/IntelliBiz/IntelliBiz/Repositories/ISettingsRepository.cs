using System.Threading.Tasks;
using IntelliBiz.Models;

namespace IntelliBiz.Repositories
{
    public interface ISettingsRepository
    {
        Task<Settings> GetSettingsAsync();
        Task<Settings> UpdateSettingsAsync(Settings settings);
    }
} 