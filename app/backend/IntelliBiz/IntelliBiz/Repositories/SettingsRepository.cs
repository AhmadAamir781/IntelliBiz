using System.Threading.Tasks;
using System.Data;
using Dapper;
using IntelliBiz.Models;
using IntelliBiz.API.Data;

namespace IntelliBiz.Repositories
{
    public class SettingsRepository : ISettingsRepository
    {
        private readonly IDatabaseConnectionFactory _connection;

        public SettingsRepository(IDatabaseConnectionFactory connection)
        {
            _connection = connection;
        }

        public async Task<Settings> GetSettingsAsync()
        {
            using var dbconnection = _connection.CreateConnection();
            const string sql = @"
                SELECT Id, SiteName, AdminEmail, SupportEmail, DefaultCurrency, 
                       TermsOfService, PrivacyPolicy, UpdatedAt
                FROM Settings";

            var settings = await dbconnection.QueryFirstOrDefaultAsync<Settings>(sql);
            return settings ?? new Settings();
        }

        public async Task<Settings> UpdateSettingsAsync(Settings settings)
        {
            var existingSettings = await GetSettingsAsync();
            
            if (existingSettings.Id == 0)
            {
                using var dbconnection = _connection.CreateConnection();

                const string insertSql = @"
                    INSERT INTO Settings (SiteName, AdminEmail, SupportEmail, DefaultCurrency, 
                                        TermsOfService, PrivacyPolicy, UpdatedAt)
                    VALUES (@SiteName, @AdminEmail, @SupportEmail, @DefaultCurrency, 
                            @TermsOfService, @PrivacyPolicy, GETDATE());
                    
                    SELECT CAST(SCOPE_IDENTITY() as int)";

                settings.Id = await dbconnection.ExecuteScalarAsync<int>(insertSql, settings);
            }
            else
            {
                using var dbconnection = _connection.CreateConnection();

                const string updateSql = @"
                    UPDATE Settings
                    SET SiteName = @SiteName,
                        AdminEmail = @AdminEmail,
                        SupportEmail = @SupportEmail,
                        DefaultCurrency = @DefaultCurrency,
                        TermsOfService = @TermsOfService,
                        PrivacyPolicy = @PrivacyPolicy,
                        UpdatedAt = GETDATE()
                    WHERE Id = @Id";

                settings.Id = existingSettings.Id;
                await dbconnection.ExecuteAsync(updateSql, settings);
            }

            return settings;
        }
    }
} 