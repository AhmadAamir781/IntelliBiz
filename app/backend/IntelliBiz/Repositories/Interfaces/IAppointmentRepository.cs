
using IntelliBiz.Models;

namespace IntelliBiz.Repositories.Interfaces;

public interface IAppointmentRepository
{
    Task<Appointment> CreateAppointmentAsync(int businessId, int userId, CreateAppointmentRequest request);
    Task<IEnumerable<AppointmentResponse>> GetBusinessAppointmentsAsync(int businessId, DateTime startDate, DateTime endDate);
    Task<IEnumerable<AppointmentResponse>> GetUserAppointmentsAsync(int userId);
    Task UpdateAppointmentStatusAsync(int appointmentId, string status);
} 