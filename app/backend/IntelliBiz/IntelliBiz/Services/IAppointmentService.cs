using IntelliBiz.API.DTOs;

namespace IntelliBiz.API.Services
{
    public interface IAppointmentService
    {
        Task<AppointmentDto?> GetByIdAsync(int id);
        Task<IEnumerable<AppointmentDto>> GetAllAsync();
        Task<IEnumerable<AppointmentDto>> GetByUserIdAsync(int userId);
        Task<IEnumerable<AppointmentDto>> GetByBusinessIdAsync(int businessId);
        Task<IEnumerable<AppointmentDto>> GetByStatusAsync(string status);
        Task<ApiResponseDto<AppointmentDto>> CreateAsync(AppointmentDto appointmentDto);
        Task<ApiResponseDto<AppointmentDto>> UpdateAsync(int id, AppointmentDto appointmentDto);
        Task<ApiResponseDto<bool>> DeleteAsync(int id);
        Task<ApiResponseDto<bool>> UpdateStatusAsync(int id, string status);
    }
}
