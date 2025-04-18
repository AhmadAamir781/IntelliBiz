using System.Threading.Tasks;
using IntelliBiz.Models;

namespace IntelliBiz.Services
{
    public interface ISettingsService
    {
        Task<Settings> GetSettingsAsync();
        Task<Settings> UpdateSettingsAsync(Settings settings);
    }
} 