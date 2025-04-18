using Dapper;
using IntelliBiz.API.Data;
using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly IDatabaseConnectionFactory _connectionFactory;

        public ServiceRepository(IDatabaseConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<Service?> GetByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT s.*, b.Name as BusinessName
                FROM Services s
                JOIN Businesses b ON s.BusinessId = b.Id
                WHERE s.Id = @Id";
            return await connection.QueryFirstOrDefaultAsync<Service>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Service>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT s.*, b.Name as BusinessName
                FROM Services s
                JOIN Businesses b ON s.BusinessId = b.Id
                ORDER BY s.CreatedAt DESC";
            return await connection.QueryAsync<Service>(sql);
        }

        public async Task<IEnumerable<Service>> GetByBusinessIdAsync(int businessId)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT s.*, b.Name as BusinessName
                FROM Services s
                JOIN Businesses b ON s.BusinessId = b.Id
                WHERE s.BusinessId = @BusinessId
                ORDER BY s.CreatedAt DESC";
            return await connection.QueryAsync<Service>(sql, new { BusinessId = businessId });
        }

        public async Task<int> CreateAsync(Service service)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                INSERT INTO Services (BusinessId, Name, Description, Price, Duration, IsActive, CreatedAt)
                VALUES (@BusinessId, @Name, @Description, @Price, @Duration, @IsActive, @CreatedAt);
                SELECT CAST(SCOPE_IDENTITY() as int)";
            
            service.CreatedAt = DateTime.UtcNow;
            return await connection.QuerySingleAsync<int>(sql, service);
        }

        public async Task<bool> UpdateAsync(Service service)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                UPDATE Services
                SET Name = @Name,
                    Description = @Description,
                    Price = @Price,
                    Duration = @Duration,
                    IsActive = @IsActive,
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id";
            
            service.UpdatedAt = DateTime.UtcNow;
            int rowsAffected = await connection.ExecuteAsync(sql, service);
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = "DELETE FROM Services WHERE Id = @Id";
            int rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<bool> ToggleActiveStatusAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                UPDATE Services
                SET IsActive = ~IsActive,
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id";
            
            int rowsAffected = await connection.ExecuteAsync(sql, new { Id = id, UpdatedAt = DateTime.UtcNow });
            return rowsAffected > 0;
        }
    }
}
