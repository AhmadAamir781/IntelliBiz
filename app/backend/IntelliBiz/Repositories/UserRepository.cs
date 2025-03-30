using System.Data;
using Dapper;
using IntelliBiz.Models;
using IntelliBiz.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace IntelliBiz.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IDbConnection _db;

    public UserRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<User?> GetUserByAuth0IdAsync(string auth0Id)
    {
        var parameters = new { Auth0Id = auth0Id };
        return await _db.QueryFirstOrDefaultAsync<User>("GetUserByAuth0Id", parameters, commandType: CommandType.StoredProcedure);
    }

    public async Task<User> GetUserByEmailAsync(string email)
    {
        var query = "SELECT * FROM Users WHERE Email = @Email";
        return await _db.QueryFirstOrDefaultAsync<User>(query, new { Email = email });
    }

    public async Task<User> CreateUserAsync(CreateUserRequest request)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Email", request.Email);
        parameters.Add("@FirstName", request.FirstName);
        parameters.Add("@LastName", request.LastName);
        parameters.Add("@Password", request.Password);
        parameters.Add("@Auth0Id", request.Auth0Id);
        parameters.Add("@Role", request.Role);
        parameters.Add("@UserId", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await _db.ExecuteAsync("CreateUser", parameters, commandType: CommandType.StoredProcedure);

        var userId = parameters.Get<int>("@UserId");
        return await GetUserByAuth0IdAsync(request.Auth0Id) 
            ?? throw new InvalidOperationException("Failed to create user");
    }

    public async Task<User> UpdateUserAsync(int userId, UpdateUserRequest request)
    {
        var parameters = new
        {
            UserId = userId,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Password = request.Password,
            Email = request.Email
        };

        await _db.ExecuteAsync("UpdateUser", parameters, commandType: CommandType.StoredProcedure);
        return await GetUserByAuth0IdAsync(request.Email) 
            ?? throw new InvalidOperationException("Failed to update user");
    }

    public async Task<IEnumerable<Business>> GetUserBusinessesAsync(int userId)
    {
        var parameters = new { UserId = userId };
        return await _db.QueryAsync<Business>("GetUserBusinesses", parameters, commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<Review>> GetUserReviewsAsync(int userId)
    {
        var parameters = new { UserId = userId };
        return await _db.QueryAsync<Review>("GetUserReviews", parameters, commandType: CommandType.StoredProcedure);
    }
} 