using System.Data;
using Dapper;
using IntelliBiz.Models;
using IntelliBiz.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace IntelliBiz.Repositories;

public class BusinessRepository : IBusinessRepository
{
    private readonly IDbConnection _db;

    public BusinessRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Business>> GetFeaturedBusinessesAsync(int count = 6)
    {
        var parameters = new { TopCount = count };
        return await _db.QueryAsync<Business>("GetFeaturedBusinesses", parameters, commandType: CommandType.StoredProcedure);
    }

    public async Task<Business?> GetBusinessDetailsAsync(int businessId)
    {
        var parameters = new { BusinessId = businessId };
        using var multi = await _db.QueryMultipleAsync("GetBusinessDetails", parameters, commandType: CommandType.StoredProcedure);

        var business = await multi.ReadFirstOrDefaultAsync<Business>();
        if (business == null) return null;

        business.Images = (await multi.ReadAsync<BusinessImage>()).ToList();
        business.Hours = (await multi.ReadAsync<BusinessHour>()).ToList();
        business.Reviews = (await multi.ReadAsync<Review>()).ToList();

        return business;
    }

    public async Task<Business> CreateBusinessAsync(CreateBusinessRequest request, int userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Name", request.Name);
        parameters.Add("@Description", request.Description);
        parameters.Add("@CategoryId", request.CategoryId);
        parameters.Add("@Address", request.Address);
        parameters.Add("@Phone", request.Phone);
        parameters.Add("@Email", request.Email);
        parameters.Add("@Website", request.Website);
        parameters.Add("@CreatedBy", userId);
        parameters.Add("@BusinessId", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await _db.ExecuteAsync("dbo.CreateBusiness", parameters, commandType: CommandType.StoredProcedure);

        var businessId = parameters.Get<int>("@BusinessId");
        return await GetBusinessDetailsAsync(businessId) 
            ?? throw new InvalidOperationException("Failed to create business");
    }

    public async Task<Business> UpdateBusinessAsync(int businessId, UpdateBusinessRequest request)
    {
        var parameters = new
        {
            BusinessId = businessId,
            Name = request.Name,
            Description = request.Description,
            CategoryId = request.CategoryId,
            Address = request.Address,
            Phone = request.Phone,
            Email = request.Email,
            Website = request.Website
        };

        await _db.ExecuteAsync("UpdateBusiness", parameters, commandType: CommandType.StoredProcedure);
        return await GetBusinessDetailsAsync(businessId) 
            ?? throw new InvalidOperationException("Failed to update business");
    }

    public async Task<BusinessImage> AddBusinessImageAsync(int businessId, BusinessImageRequest request)
    {
        var parameters = new
        {
            BusinessId = businessId,
            ImageUrl = request.ImageUrl,
            IsMain = request.IsMain
        };

        await _db.ExecuteAsync("AddBusinessImage", parameters, commandType: CommandType.StoredProcedure);
        return new BusinessImage
        {
            BusinessId = businessId,
            ImageUrl = request.ImageUrl,
            IsMain = request.IsMain,
            CreatedAt = DateTime.UtcNow
        };
    }

    public async Task<Review> AddBusinessReviewAsync(int businessId, int userId, CreateReviewRequest request)
    {
        var parameters = new
        {
            BusinessId = businessId,
            UserId = userId,
            Rating = request.Rating,
            Comment = request.Comment
        };

        await _db.ExecuteAsync("AddBusinessReview", parameters, commandType: CommandType.StoredProcedure);
        return new Review
        {
            BusinessId = businessId,
            UserId = userId,
            Rating = request.Rating,
            Comment = request.Comment,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public async Task<IEnumerable<Business>> GetUserBusinessesAsync(int userId)
    {
        var parameters = new { UserId = userId };
        return await _db.QueryAsync<Business>("GetUserBusinesses", parameters, commandType: CommandType.StoredProcedure);
    }
} 