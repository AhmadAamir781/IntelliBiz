using Dapper;
using Microsoft.Data.SqlClient;
using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories;

public class BusinessRepository : IBusinessRepository
{
    private readonly string _connectionString;
    private const string GetBusinessesProcedure = "sp_GetBusinesses";
    private const string GetBusinessByIdProcedure = "sp_GetBusinessById";
    private const string AddBusinessProcedure = "sp_AddBusiness";
    private const string UpdateBusinessProcedure = "sp_UpdateBusiness";
    private const string DeleteBusinessProcedure = "sp_DeleteBusiness";

    public BusinessRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new ArgumentNullException(nameof(configuration));
    }

    public async Task<IEnumerable<Business>> GetAllAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<Business>(GetBusinessesProcedure);
    }

    public async Task<Business?> GetByIdAsync(int id)
    {
        using var connection = new SqlConnection(_connectionString);
        var parameters = new { Id = id };
        return await connection.QueryFirstOrDefaultAsync<Business>(GetBusinessByIdProcedure, parameters);
    }

    public async Task<int> CreateAsync(CreateBusinessRequest business)
    {
        using var connection = new SqlConnection(_connectionString);
        var parameters = new DynamicParameters();
        parameters.Add("@Name", business.Name);
        parameters.Add("@Category", business.Category);
        parameters.Add("@Owner", business.Owner);
        parameters.Add("@Location", business.Location);
        parameters.Add("@Verified", business.Verified);
        parameters.Add("@Id", dbType: System.Data.DbType.Int32, direction: System.Data.ParameterDirection.Output);

        await connection.ExecuteAsync(AddBusinessProcedure, parameters);
        return parameters.Get<int>("@Id");
    }

    public async Task<bool> UpdateAsync(int id, UpdateBusinessRequest business)
    {
        using var connection = new SqlConnection(_connectionString);
        var parameters = new
        {
            Id = id,
            business.Name,
            business.Category,
            business.Owner,
            business.Location,
            business.Status,
            business.Verified
        };

        var rowsAffected = await connection.ExecuteAsync(UpdateBusinessProcedure, parameters);
        return rowsAffected > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = new SqlConnection(_connectionString);
        var parameters = new { Id = id };
        var rowsAffected = await connection.ExecuteAsync(DeleteBusinessProcedure, parameters);
        return rowsAffected > 0;
    }
} 