using Dapper;
using Microsoft.Data.SqlClient;
using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly string _connectionString;
    private const string GetCategoriesProcedure = "sp_GetCategories";

    public CategoryRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new ArgumentNullException(nameof(configuration));
    }

    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<Category>(GetCategoriesProcedure);
    }
} 