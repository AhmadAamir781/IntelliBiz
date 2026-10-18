using IntelliBiz.DTOs;
using IntelliBiz.Models;
using IntelliBiz.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntelliBiz.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController(ISettingsService settingsService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<SettingsDto>> GetSettings()
        {
            var settings = await settingsService.GetSettingsAsync();
            var settingsDto = new SettingsDto
            {
                SiteName = settings.SiteName,
                AdminEmail = settings.AdminEmail,
                SupportEmail = settings.SupportEmail,
                DefaultCurrency = settings.DefaultCurrency,
                TermsOfService = settings.TermsOfService,
                PrivacyPolicy = settings.PrivacyPolicy,
                UpdatedAt = settings.UpdatedAt
            };
            return Ok(settingsDto);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<SettingsDto>> UpdateSettings([FromBody] SettingsDto settingsDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var settings = new Settings
            {
                SiteName = settingsDto.SiteName,
                AdminEmail = settingsDto.AdminEmail,
                SupportEmail = settingsDto.SupportEmail,
                DefaultCurrency = settingsDto.DefaultCurrency,
                TermsOfService = settingsDto.TermsOfService,
                PrivacyPolicy = settingsDto.PrivacyPolicy,
                UpdatedAt = DateTime.UtcNow
            };

            var updatedSettings = await settingsService.UpdateSettingsAsync(settings);
            var updatedSettingsDto = new SettingsDto
            {
                SiteName = updatedSettings.SiteName,
                AdminEmail = updatedSettings.AdminEmail,
                SupportEmail = updatedSettings.SupportEmail,
                DefaultCurrency = updatedSettings.DefaultCurrency,
                TermsOfService = updatedSettings.TermsOfService,
                PrivacyPolicy = updatedSettings.PrivacyPolicy,
                UpdatedAt = updatedSettings.UpdatedAt
            };

            return Ok(updatedSettingsDto);
        }
    }
}