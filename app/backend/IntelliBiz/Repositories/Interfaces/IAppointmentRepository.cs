using IntelliBiz.Models;

namespace IntelliBiz.Repositories.Interfaces
{
    public interface IAppointmentRepository
    {
        Task<int> CreateAppointmentAsync(Appointment appointment);
        Task<int> DeleteAppointmentAsync(int appointmentId);
        Task<IEnumerable<Appointment>> GetAllAppointmentsAsync(int businessId);
        Task<Appointment> ReadAppointmentAsync(int appointmentId);
        Task<int> UpdateAppointmentAsync(Appointment appointment);
    }
}