using IntelliBiz.Models;
using IntelliBiz.Repositories;

namespace IntelliBiz.Services
{
    public class SettingsService(ISettingsRepository settingsRepository) : ISettingsService
    {
        public async Task<Settings> GetSettingsAsync()
        {
            return await settingsRepository.GetSettingsAsync();
        }

        public async Task<Settings> UpdateSettingsAsync(Settings settings)
        {
            return await settingsRepository.UpdateSettingsAsync(settings);
        }
    }
} 