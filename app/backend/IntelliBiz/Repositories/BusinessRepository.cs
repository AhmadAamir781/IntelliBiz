using Dapper;
using IntelliBiz.API.Models;
using IntelliBiz.Database;
using System.Text;

namespace IntelliBiz.Repositories
{
    public class BusinessRepository : IBusinessRepository
    {
        private readonly DapperContext _context;

        public BusinessRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<Business>> GetBusinessesAsync(BusinessQueryParameters parameters)
        {
            var result = new PagedResult<Business>
            {
                CurrentPage = parameters.Page,
                PageSize = parameters.PageSize
            };

            using var connection = _context.CreateConnection();

            // Build the query dynamically
            var queryBuilder = new StringBuilder();
            var countQueryBuilder = new StringBuilder();
            var whereClauseBuilder = new StringBuilder();
            var parameters_dict = new DynamicParameters();

            // Base query
            queryBuilder.Append("SELECT * FROM Businesses");
            countQueryBuilder.Append("SELECT COUNT(*) FROM Businesses");

            // Where clause
            var whereConditions = new List<string>();

            if (!string.IsNullOrEmpty(parameters.Search))
            {
                whereConditions.Add("(Name LIKE @Search OR Description LIKE @Search)");
                parameters_dict.Add("Search", $"%{parameters.Search}%");
            }

            if (!string.IsNullOrEmpty(parameters.Category))
            {
                whereConditions.Add("Category = @Category");
                parameters_dict.Add("Category", parameters.Category);
            }

            if (!string.IsNullOrEmpty(parameters.City))
            {
                whereConditions.Add("City = @City");
                parameters_dict.Add("City", parameters.City);
            }

            if (!string.IsNullOrEmpty(parameters.State))
            {
                whereConditions.Add("State = @State");
                parameters_dict.Add("State", parameters.State);
            }

            if (parameters.IsVerified.HasValue)
            {
                whereConditions.Add("IsVerified = @IsVerified");
                parameters_dict.Add("IsVerified", parameters.IsVerified.Value);
            }

            if (parameters.IsActive.HasValue)
            {
                whereConditions.Add("IsActive = @IsActive");
                parameters_dict.Add("IsActive", parameters.IsActive.Value);
            }

            if (whereConditions.Count > 0)
            {
                whereClauseBuilder.Append(" WHERE ");
                whereClauseBuilder.Append(string.Join(" AND ", whereConditions));
            }

            // Add where clause to both queries
            queryBuilder.Append(whereClauseBuilder);
            countQueryBuilder.Append(whereClauseBuilder);

            // Add sorting
            if (!string.IsNullOrEmpty(parameters.SortBy))
            {
                var sortDirection = string.Equals(parameters.Order, "desc", StringComparison.OrdinalIgnoreCase)
                    ? "DESC"
                    : "ASC";
                queryBuilder.Append($" ORDER BY {parameters.SortBy} {sortDirection}");
            }
            else
            {
                queryBuilder.Append(" ORDER BY AverageRating DESC, Name ASC");
            }

            // Add pagination
            queryBuilder.Append(" OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY");
            parameters_dict.Add("PageSize", parameters.PageSize);
            parameters_dict.Add("Offset", (parameters.Page - 1) * parameters.PageSize);

            // Execute count query
            var totalCount = await connection.ExecuteScalarAsync<int>(countQueryBuilder.ToString(), parameters_dict);
            result.TotalCount = totalCount;
            result.PageCount = (int)Math.Ceiling(totalCount / (double)parameters.PageSize);

            // Execute main query
            var businesses = await connection.QueryAsync<Business>(queryBuilder.ToString(), parameters_dict);

            // Get related data for each business
            var businessList = businesses.ToList();
            foreach (var business in businessList)
            {
                business.BusinessHours = (await GetBusinessHoursAsync(business.Id)).ToList();
                business.Services = (await GetBusinessServicesAsync(business.Id)).ToList();
                business.Images = (await GetBusinessImagesAsync(business.Id)).ToList();
            }

            result.Items = businessList;

            return result;
        }

        public async Task<Business?> GetBusinessByIdAsync(int id)
        {
            var query = "SELECT * FROM Businesses WHERE Id = @Id";

            using var connection = _context.CreateConnection();
            var business = await connection.QuerySingleOrDefaultAsync<Business>(query, new { Id = id });

            if (business != null)
            {
                business.BusinessHours = (await GetBusinessHoursAsync(business.Id)).ToList();
                business.Services = (await GetBusinessServicesAsync(business.Id)).ToList();
                business.Images = (await GetBusinessImagesAsync(business.Id)).ToList();
            }

            return business;
        }

        public async Task<IEnumerable<Business>> GetBusinessesByOwnerIdAsync(int ownerId)
        {
            var query = "SELECT * FROM Businesses WHERE OwnerId = @OwnerId ORDER BY CreatedAt DESC";

            using var connection = _context.CreateConnection();
            var businesses = await connection.QueryAsync<Business>(query, new { OwnerId = ownerId });

            var businessList = businesses.ToList();
            foreach (var business in businessList)
            {
                business.BusinessHours = (await GetBusinessHoursAsync(business.Id)).ToList();
                business.Services = (await GetBusinessServicesAsync(business.Id)).ToList();
                business.Images = (await GetBusinessImagesAsync(business.Id)).ToList();
            }

            return businessList;
        }

        public async Task<int> CreateBusinessAsync(Business business)
        {
            var query = @"
                INSERT INTO Businesses (OwnerId, Name, Description, Category, Address, City, State, ZipCode, 
                                      PhoneNumber, Email, Website, LogoUrl, CoverImageUrl, IsVerified, IsActive, 
                                      AverageRating, ReviewCount, CreatedAt) 
                OUTPUT INSERTED.Id
                VALUES (@OwnerId, @Name, @Description, @Category, @Address, @City, @State, @ZipCode, 
                       @PhoneNumber, @Email, @Website, @LogoUrl, @CoverImageUrl, @IsVerified, @IsActive, 
                       @AverageRating, @ReviewCount, @CreatedAt)";

            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(query, business);
        }

        public async Task<bool> UpdateBusinessAsync(Business business)
        {
            var query = @"
                UPDATE Businesses 
                SET Name = @Name, 
                    Description = @Description, 
                    Category = @Category, 
                    Address = @Address, 
                    City = @City, 
                    State = @State, 
                    ZipCode = @ZipCode, 
                    PhoneNumber = @PhoneNumber, 
                    Email = @Email, 
                    Website = @Website, 
                    LogoUrl = @LogoUrl, 
                    CoverImageUrl = @CoverImageUrl, 
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id";

            business.UpdatedAt = DateTime.UtcNow;

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query, business);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteBusinessAsync(int id)
        {
            using var connection = _context.CreateConnection();

            // Begin transaction to delete related records
            using var transaction = connection.BeginTransaction();

            try
            {
                // Delete business hours
                await connection.ExecuteAsync("DELETE FROM BusinessHours WHERE BusinessId = @BusinessId",
                    new { BusinessId = id }, transaction);

                // Delete business services
                await connection.ExecuteAsync("DELETE FROM BusinessServices WHERE BusinessId = @BusinessId",
                    new { BusinessId = id }, transaction);

                // Delete business images
                await connection.ExecuteAsync("DELETE FROM BusinessImages WHERE BusinessId = @BusinessId",
                    new { BusinessId = id }, transaction);

                // Delete business reviews
                await connection.ExecuteAsync("DELETE FROM Reviews WHERE BusinessId = @BusinessId",
                    new { BusinessId = id }, transaction);

                // Delete the business
                var affectedRows = await connection.ExecuteAsync("DELETE FROM Businesses WHERE Id = @Id",
                    new { Id = id }, transaction);

                transaction.Commit();
                return affectedRows > 0;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task<bool> VerifyBusinessAsync(int id, bool isVerified)
        {
            var query = "UPDATE Businesses SET IsVerified = @IsVerified, UpdatedAt = @UpdatedAt WHERE Id = @Id";

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query,
                new { Id = id, IsVerified = isVerified, UpdatedAt = DateTime.UtcNow });
            return affectedRows > 0;
        }

        public async Task<IEnumerable<string>> GetCategoriesAsync()
        {
            var query = "SELECT DISTINCT Category FROM Businesses WHERE Category IS NOT NULL ORDER BY Category";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<string>(query);
        }

        public async Task<IEnumerable<string>> GetCitiesAsync()
        {
            var query = "SELECT DISTINCT City FROM Businesses WHERE City IS NOT NULL ORDER BY City";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<string>(query);
        }

        public async Task<IEnumerable<string>> GetStatesAsync()
        {
            var query = "SELECT DISTINCT State FROM Businesses WHERE State IS NOT NULL ORDER BY State";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<string>(query);
        }

        // Business Hours methods
        public async Task<IEnumerable<BusinessHour>> GetBusinessHoursAsync(int businessId)
        {
            var query = "SELECT * FROM BusinessHours WHERE BusinessId = @BusinessId ORDER BY DayOfWeek";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<BusinessHour>(query, new { BusinessId = businessId });
        }

        public async Task<int> CreateBusinessHourAsync(BusinessHour businessHour)
        {
            var query = @"
                INSERT INTO BusinessHours (BusinessId, DayOfWeek, OpenTime, CloseTime, IsClosed) 
                OUTPUT INSERTED.Id
                VALUES (@BusinessId, @DayOfWeek, @OpenTime, @CloseTime, @IsClosed)";

            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(query, businessHour);
        }

        public async Task<bool> UpdateBusinessHourAsync(BusinessHour businessHour)
        {
            var query = @"
                UPDATE BusinessHours 
                SET OpenTime = @OpenTime, 
                    CloseTime = @CloseTime, 
                    IsClosed = @IsClosed
                WHERE Id = @Id AND BusinessId = @BusinessId";

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query, businessHour);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteBusinessHoursAsync(int businessId)
        {
            var query = "DELETE FROM BusinessHours WHERE BusinessId = @BusinessId";

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query, new { BusinessId = businessId });
            return affectedRows > 0;
        }

        // Business Services methods
        public async Task<IEnumerable<BusinessService>> GetBusinessServicesAsync(int businessId)
        {
            var query = "SELECT * FROM BusinessServices WHERE BusinessId = @BusinessId";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<BusinessService>(query, new { BusinessId = businessId });
        }

        public async Task<BusinessService?> GetBusinessServiceByIdAsync(int id)
        {
            var query = "SELECT * FROM BusinessServices WHERE Id = @Id";

            using var connection = _context.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<BusinessService>(query, new { Id = id });
        }

        public async Task<int> CreateBusinessServiceAsync(BusinessService service)
        {
            var query = @"
                INSERT INTO BusinessServices (BusinessId, Name, Description, Price, DurationMinutes, IsActive) 
                OUTPUT INSERTED.Id
                VALUES (@BusinessId, @Name, @Description, @Price, @DurationMinutes, @IsActive)";

            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(query, service);
        }

        public async Task<bool> UpdateBusinessServiceAsync(BusinessService service)
        {
            var query = @"
                UPDATE BusinessServices 
                SET Name = @Name, 
                    Description = @Description, 
                    Price = @Price, 
                    DurationMinutes = @DurationMinutes, 
                    IsActive = @IsActive
                WHERE Id = @Id AND BusinessId = @BusinessId";

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query, service);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteBusinessServiceAsync(int id)
        {
            var query = "DELETE FROM BusinessServices WHERE Id = @Id";

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query, new { Id = id });
            return affectedRows > 0;
        }

        // Business Images methods
        public async Task<IEnumerable<string>> GetBusinessImagesAsync(int businessId)
        {
            var query = "SELECT ImageUrl FROM BusinessImages WHERE BusinessId = @BusinessId";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<string>(query, new { BusinessId = businessId });
        }

        public async Task<bool> AddBusinessImageAsync(int businessId, string imageUrl)
        {
            var query = @"
                INSERT INTO BusinessImages (BusinessId, ImageUrl) 
                VALUES (@BusinessId, @ImageUrl)";

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query, new { BusinessId = businessId, ImageUrl = imageUrl });
            return affectedRows > 0;
        }

        public async Task<bool> DeleteBusinessImageAsync(int businessId, string imageUrl)
        {
            var query = "DELETE FROM BusinessImages WHERE BusinessId = @BusinessId AND ImageUrl = @ImageUrl";

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query, new { BusinessId = businessId, ImageUrl = imageUrl });
            return affectedRows > 0;
        }

        // Reviews methods
        public async Task<IEnumerable<Review>> GetBusinessReviewsAsync(int businessId)
        {
            var query = @"
                SELECT r.*, u.Username, u.FirstName, u.LastName 
                FROM Reviews r
                JOIN Users u ON r.UserId = u.Id
                WHERE r.BusinessId = @BusinessId
                ORDER BY r.CreatedAt DESC";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<Review>(query, new { BusinessId = businessId });
        }

        public async Task<Review?> GetReviewByIdAsync(int id)
        {
            var query = @"
                SELECT r.*, u.Username, u.FirstName, u.LastName 
                FROM Reviews r
                JOIN Users u ON r.UserId = u.Id
                WHERE r.Id = @Id";

            using var connection = _context.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<Review>(query, new { Id = id });
        }

        public async Task<int> CreateReviewAsync(Review review)
        {
            var query = @"
                INSERT INTO Reviews (BusinessId, UserId, Rating, Comment, CreatedAt) 
                OUTPUT INSERTED.Id
                VALUES (@BusinessId, @UserId, @Rating, @Comment, @CreatedAt)";

            using var connection = _context.CreateConnection();
            var id = await connection.ExecuteScalarAsync<int>(query, review);

            // Update business average rating
            await UpdateBusinessRatingAsync(review.BusinessId);

            return id;
        }

        public async Task<bool> UpdateReviewAsync(Review review)
        {
            var query = @"
                UPDATE Reviews 
                SET Rating = @Rating, 
                    Comment = @Comment, 
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id AND UserId = @UserId";

            review.UpdatedAt = DateTime.UtcNow;

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query, review);

            if (affectedRows > 0)
            {
                // Update business average rating
                await UpdateBusinessRatingAsync(review.BusinessId);
                return true;
            }

            return false;
        }

        public async Task<bool> DeleteReviewAsync(int id)
        {
            // First get the review to know which business to update
            var getQuery = "SELECT BusinessId FROM Reviews WHERE Id = @Id";

            using var connection = _context.CreateConnection();
            var businessId = await connection.ExecuteScalarAsync<int>(getQuery, new { Id = id });

            // Delete the review
            var deleteQuery = "DELETE FROM Reviews WHERE Id = @Id";
            var affectedRows = await connection.ExecuteAsync(deleteQuery, new { Id = id });

            if (affectedRows > 0)
            {
                // Update business average rating
                await UpdateBusinessRatingAsync(businessId);
                return true;
            }

            return false;
        }

        public async Task<bool> UpdateBusinessRatingAsync(int businessId)
        {
            var query = @"
                UPDATE Businesses 
                SET AverageRating = (
                    SELECT AVG(CAST(Rating AS FLOAT)) 
                    FROM Reviews 
                    WHERE BusinessId = @BusinessId
                ),
                ReviewCount = (
                    SELECT COUNT(*) 
                    FROM Reviews 
                    WHERE BusinessId = @BusinessId
                ),
                UpdatedAt = @UpdatedAt
                WHERE Id = @BusinessId";

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query,
                new { BusinessId = businessId, UpdatedAt = DateTime.UtcNow });
            return affectedRows > 0;
        }
    }
}