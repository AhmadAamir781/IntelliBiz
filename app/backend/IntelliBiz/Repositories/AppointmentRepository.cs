using System.Data;
using Dapper;
using IntelliBiz.Models;
using IntelliBiz.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace IntelliBiz.Repositories;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly IDbConnection _db;

    public AppointmentRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<Appointment> CreateAppointmentAsync(int businessId, int userId, CreateAppointmentRequest request)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@BusinessId", businessId);
        parameters.Add("@UserId", userId);
        parameters.Add("@AppointmentDate", request.AppointmentDate.Date);
        parameters.Add("@AppointmentTime", request.AppointmentTime);
        parameters.Add("@Notes", request.Notes);
        parameters.Add("@AppointmentId", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await _db.ExecuteAsync("CreateAppointment", parameters, commandType: CommandType.StoredProcedure);

        var appointmentId = parameters.Get<int>("@AppointmentId");
        return await GetAppointmentByIdAsync(appointmentId) 
            ?? throw new InvalidOperationException("Failed to create appointment");
    }

    public async Task<IEnumerable<AppointmentResponse>> GetBusinessAppointmentsAsync(int businessId, DateTime startDate, DateTime endDate)
    {
        var parameters = new
        {
            BusinessId = businessId,
            StartDate = startDate.Date,
            EndDate = endDate.Date
        };

        return await _db.QueryAsync<AppointmentResponse>("GetBusinessAppointments", parameters, commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<AppointmentResponse>> GetUserAppointmentsAsync(int userId)
    {
        var parameters = new { UserId = userId };
        return await _db.QueryAsync<AppointmentResponse>("GetUserAppointments", parameters, commandType: CommandType.StoredProcedure);
    }

    public async Task UpdateAppointmentStatusAsync(int appointmentId, string status)
    {
        var parameters = new
        {
            AppointmentId = appointmentId,
            Status = status
        };

        await _db.ExecuteAsync("UpdateAppointmentStatus", parameters, commandType: CommandType.StoredProcedure);
    }

    private async Task<Appointment?> GetAppointmentByIdAsync(int appointmentId)
    {
        var parameters = new { AppointmentId = appointmentId };
        return await _db.QueryFirstOrDefaultAsync<Appointment>("GetAppointmentById", parameters, commandType: CommandType.StoredProcedure);
    }
} 