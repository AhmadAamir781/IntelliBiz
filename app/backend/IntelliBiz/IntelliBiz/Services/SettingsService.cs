using System.Threading.Tasks;
using IntelliBiz.Models;
using IntelliBiz.Repositories;

namespace IntelliBiz.Services
{
    public class SettingsService : ISettingsService
    {
        private readonly ISettingsRepository _settingsRepository;

        public SettingsService(ISettingsRepository settingsRepository)
        {
            _settingsRepository = settingsRepository;
        }

        public async Task<Settings> GetSettingsAsync()
        {
            return await _settingsRepository.GetSettingsAsync();
        }

        public async Task<Settings> UpdateSettingsAsync(Settings settings)
        {
            return await _settingsRepository.UpdateSettingsAsync(settings);
        }
    }
} 