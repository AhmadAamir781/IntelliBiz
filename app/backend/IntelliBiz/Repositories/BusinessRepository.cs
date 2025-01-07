namespace IntelliBiz.Repositories
{
    using Dapper;
    using IntelliBiz.Models;
    using IntelliBiz.Repositories.Interfaces;
    using Microsoft.Data.SqlClient;
    using Microsoft.Extensions.Configuration;
    using System.Collections.Generic;
    using System.Data;
    using System.Threading.Tasks;

    public class BusinessRepository : IBusinessRepository
    {
        private readonly string _connectionString;

        public BusinessRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<int> CreateBusinessAsync(Business business)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_user_id", business.UserId);
                parameters.Add("@p_name", business.Name);
                parameters.Add("@p_description", business.Description);
                parameters.Add("@p_category", business.Category);
                parameters.Add("@p_contact_number", business.ContactNumber);
                parameters.Add("@p_whatsapp", business.Whatsapp);
                parameters.Add("@p_address", business.Address);
                parameters.Add("@p_business_hours", business.BusinessHours);
                parameters.Add("@p_photos", business.Photos);

                return await connection.ExecuteAsync("dbo.CreateBusiness", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        public async Task<int> UpdateBusinessAsync(Business business)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_business_id", business.BusinessId);
                parameters.Add("@p_name", business.Name);
                parameters.Add("@p_description", business.Description);
                parameters.Add("@p_category", business.Category);
                parameters.Add("@p_contact_number", business.ContactNumber);
                parameters.Add("@p_whatsapp", business.Whatsapp);
                parameters.Add("@p_address", business.Address);
                parameters.Add("@p_business_hours", business.BusinessHours);
                parameters.Add("@p_photos", business.Photos);

                return await connection.ExecuteAsync("dbo.UpdateBusiness", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        public async Task<int> DeleteBusinessAsync(int businessId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_business_id", businessId);
                return await connection.ExecuteAsync("dbo.DeleteBusiness", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        public async Task<Business> ReadBusinessAsync(int businessId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_business_id", businessId);
                return await connection.QueryFirstOrDefaultAsync<Business>("dbo.ReadBusiness", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        public async Task<IEnumerable<Business>> GetAllBusinessesAsync()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection.QueryAsync<Business>("SELECT * FROM BUSINESS", commandType: CommandType.Text);
            }
        }
    }

}
