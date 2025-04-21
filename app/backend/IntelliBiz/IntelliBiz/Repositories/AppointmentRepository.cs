using Dapper;
using IntelliBiz.API.Data;
using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly IDatabaseConnectionFactory _connectionFactory;

        public AppointmentRepository(IDatabaseConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<Appointment?> GetByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT a.*, 
                       u.FirstName + ' ' + u.LastName as CustomerName,
                       u.Email as CustomerEmail,
                       b.Name as BusinessName,
                       s.Name as ServiceName
                FROM Appointments a
                JOIN Users u ON a.UserId = u.Id
                JOIN Businesses b ON a.BusinessId = b.Id
                JOIN Services s ON a.ServiceId = s.Id
                WHERE a.Id = @Id";
            return await connection.QueryFirstOrDefaultAsync<Appointment>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Appointment>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT a.*, 
                       u.FirstName + ' ' + u.LastName as CustomerName,
                       u.Email as CustomerEmail,
                       b.Name as BusinessName,
                       s.Name as ServiceName
                FROM Appointments a
                JOIN Users u ON a.UserId = u.Id
                JOIN Businesses b ON a.BusinessId = b.Id
                JOIN Services s ON a.ServiceId = s.Id
                ORDER BY a.AppointmentDate DESC";
            return await connection.QueryAsync<Appointment>(sql);
        }

        public async Task<IEnumerable<Appointment>> GetByUserIdAsync(int userId)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT a.*, 
                       u.FirstName + ' ' + u.LastName as CustomerName,
                       u.Email as CustomerEmail,
                       b.Name as BusinessName,
                       s.Name as ServiceName
                FROM Appointments a
                JOIN Users u ON a.UserId = u.Id
                JOIN Businesses b ON a.BusinessId = b.Id
                JOIN Services s ON a.ServiceId = s.Id
                WHERE a.UserId = @UserId
                ORDER BY a.AppointmentDate DESC";
            return await connection.QueryAsync<Appointment>(sql, new { UserId = userId });
        }

        public async Task<IEnumerable<Appointment>> GetByBusinessIdAsync(int businessId)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT a.*, 
                       u.FirstName + ' ' + u.LastName as CustomerName,
                       u.Email as CustomerEmail,
                       u.Phone as CustomerPhone,
                       b.Name as BusinessName,
                       s.Name as ServiceName
                FROM Appointments a
                JOIN Users u ON a.UserId = u.Id
                JOIN Businesses b ON a.BusinessId = b.Id
                JOIN Services s ON a.ServiceId = s.Id
                WHERE a.BusinessId = @BusinessId
                ORDER BY a.AppointmentDate DESC, a.StartTime DESC";
            return await connection.QueryAsync<Appointment>(sql, new { BusinessId = businessId });
        }

        public async Task<IEnumerable<Appointment>> GetByStatusAsync(string status)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                SELECT a.*, 
                       u.FirstName + ' ' + u.LastName as CustomerName,
                       u.Email as CustomerEmail,
                       b.Name as BusinessName,
                       s.Name as ServiceName
                FROM Appointments a
                JOIN Users u ON a.UserId = u.Id
                JOIN Businesses b ON a.BusinessId = b.Id
                JOIN Services s ON a.ServiceId = s.Id
                WHERE a.Status = @Status
                ORDER BY a.AppointmentDate DESC, a.StartTime DESC";
            return await connection.QueryAsync<Appointment>(sql, new { Status = status });
        }

        public async Task<int> CreateAsync(Appointment appointment)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                INSERT INTO Appointments (UserId, BusinessId, ServiceId, AppointmentDate, StartTime, EndTime, Status, Notes, CreatedAt)
                VALUES (@UserId, @BusinessId, @ServiceId, @AppointmentDate, @StartTime, @EndTime, @Status, @Notes, @CreatedAt);
                SELECT CAST(SCOPE_IDENTITY() as int)";
            
            appointment.CreatedAt = DateTime.UtcNow;
            appointment.ServiceId = 1;
            return await connection.QuerySingleAsync<int>(sql, appointment);
        }

        public async Task<bool> UpdateAsync(Appointment appointment)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                UPDATE Appointments
                SET AppointmentDate = @AppointmentDate,
                    StartTime = @StartTime,
                    EndTime = @EndTime,
                    Status = @Status,
                    Notes = @Notes,
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id";
            
            appointment.UpdatedAt = DateTime.UtcNow;
            int rowsAffected = await connection.ExecuteAsync(sql, appointment);
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = "DELETE FROM Appointments WHERE Id = @Id";
            int rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<bool> UpdateStatusAsync(int id, string status)
        {
            using var connection = _connectionFactory.CreateConnection();
            const string sql = @"
                UPDATE Appointments
                SET Status = @Status,
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id";
            
            int rowsAffected = await connection.ExecuteAsync(sql, new { Id = id, Status = status, UpdatedAt = DateTime.UtcNow });
            return rowsAffected > 0;
        }
    }
}
