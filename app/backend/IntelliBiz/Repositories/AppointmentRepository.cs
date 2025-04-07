using Dapper;
using IntelliBiz.API.Models;
using IntelliBiz.Database;

namespace IntelliBiz.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly DapperContext _context;

        public AppointmentRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByBusinessIdAsync(int businessId)
        {
            var query = @"
                SELECT a.*, u.Username, u.FirstName, u.LastName, u.Email, u.PhoneNumber,
                       s.Name as ServiceName, s.Price as ServicePrice, s.DurationMinutes as ServiceDuration
                FROM Appointments a
                JOIN Users u ON a.UserId = u.Id
                LEFT JOIN BusinessServices s ON a.ServiceId = s.Id
                WHERE a.BusinessId = @BusinessId
                ORDER BY a.AppointmentDate, a.StartTime";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<Appointment>(query, new { BusinessId = businessId });
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByUserIdAsync(int userId)
        {
            var query = @"
                SELECT a.*, b.Name as BusinessName, b.Address as BusinessAddress, b.City as BusinessCity,
                       s.Name as ServiceName, s.Price as ServicePrice, s.DurationMinutes as ServiceDuration
                FROM Appointments a
                JOIN Businesses b ON a.BusinessId = b.Id
                LEFT JOIN BusinessServices s ON a.ServiceId = s.Id
                WHERE a.UserId = @UserId
                ORDER BY a.AppointmentDate, a.StartTime";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<Appointment>(query, new { UserId = userId });
        }

        public async Task<Appointment?> GetAppointmentByIdAsync(int id)
        {
            var query = @"
                SELECT a.*, u.Username, u.FirstName, u.LastName, u.Email, u.PhoneNumber,
                       b.Name as BusinessName, b.Address as BusinessAddress, b.City as BusinessCity,
                       s.Name as ServiceName, s.Price as ServicePrice, s.DurationMinutes as ServiceDuration
                FROM Appointments a
                JOIN Users u ON a.UserId = u.Id
                JOIN Businesses b ON a.BusinessId = b.Id
                LEFT JOIN BusinessServices s ON a.ServiceId = s.Id
                WHERE a.Id = @Id";

            using var connection = _context.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<Appointment>(query, new { Id = id });
        }

        public async Task<int> CreateAppointmentAsync(Appointment appointment)
        {
            var query = @"
                INSERT INTO Appointments (BusinessId, UserId, ServiceId, AppointmentDate, StartTime, EndTime, 
                                        Notes, Status, CreatedAt) 
                OUTPUT INSERTED.Id
                VALUES (@BusinessId, @UserId, @ServiceId, @AppointmentDate, @StartTime, @EndTime, 
                       @Notes, @Status, @CreatedAt)";

            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(query, appointment);
        }

        public async Task<bool> UpdateAppointmentAsync(Appointment appointment)
        {
            var query = @"
                UPDATE Appointments 
                SET ServiceId = @ServiceId, 
                    AppointmentDate = @AppointmentDate, 
                    StartTime = @StartTime, 
                    EndTime = @EndTime, 
                    Notes = @Notes, 
                    Status = @Status, 
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id AND (BusinessId = @BusinessId OR UserId = @UserId)";

            appointment.UpdatedAt = DateTime.UtcNow;

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query, appointment);
            return affectedRows > 0;
        }

        public async Task<bool> UpdateAppointmentStatusAsync(int id, string status)
        {
            var query = @"
                UPDATE Appointments 
                SET Status = @Status, 
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id";

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query,
                new { Id = id, Status = status, UpdatedAt = DateTime.UtcNow });
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAppointmentAsync(int id)
        {
            var query = "DELETE FROM Appointments WHERE Id = @Id";

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query, new { Id = id });
            return affectedRows > 0;
        }

        public async Task<IEnumerable<Appointment>> GetBusinessAppointmentsByDateAsync(int businessId, DateTime date)
        {
            var query = @"
                SELECT a.*, u.Username, u.FirstName, u.LastName, u.Email, u.PhoneNumber,
                       s.Name as ServiceName, s.Price as ServicePrice, s.DurationMinutes as ServiceDuration
                FROM Appointments a
                JOIN Users u ON a.UserId = u.Id
                LEFT JOIN BusinessServices s ON a.ServiceId = s.Id
                WHERE a.BusinessId = @BusinessId AND CAST(a.AppointmentDate AS DATE) = CAST(@Date AS DATE)
                ORDER BY a.StartTime";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<Appointment>(query, new { BusinessId = businessId, Date = date });
        }

        public async Task<IEnumerable<Appointment>> GetUserAppointmentsByDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
        {
            var query = @"
                SELECT a.*, b.Name as BusinessName, b.Address as BusinessAddress, b.City as BusinessCity,
                       s.Name as ServiceName, s.Price as ServicePrice, s.DurationMinutes as ServiceDuration
                FROM Appointments a
                JOIN Businesses b ON a.BusinessId = b.Id
                LEFT JOIN BusinessServices s ON a.ServiceId = s.Id
                WHERE a.UserId = @UserId 
                  AND a.AppointmentDate >= @StartDate 
                  AND a.AppointmentDate <= @EndDate
                ORDER BY a.AppointmentDate, a.StartTime";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<Appointment>(query,
                new { UserId = userId, StartDate = startDate, EndDate = endDate });
        }
    }
}