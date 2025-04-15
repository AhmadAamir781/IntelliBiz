using IntelliBiz.API.Models;

namespace IntelliBiz.Repositories
{
    public interface IAppointmentRepository
    {
        Task<IEnumerable<Appointment>> GetAppointmentsByBusinessIdAsync(int businessId);
        Task<IEnumerable<Appointment>> GetAppointmentsByUserIdAsync(int userId);
        Task<Appointment?> GetAppointmentByIdAsync(int id);
        Task<int> CreateAppointmentAsync(Appointment appointment);
        Task<bool> UpdateAppointmentAsync(Appointment appointment);
        Task<bool> UpdateAppointmentStatusAsync(int id, string status);
        Task<bool> DeleteAppointmentAsync(int id);
        Task<IEnumerable<Appointment>> GetBusinessAppointmentsByDateAsync(int businessId, DateTime date);
        Task<IEnumerable<Appointment>> GetUserAppointmentsByDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
    }
}