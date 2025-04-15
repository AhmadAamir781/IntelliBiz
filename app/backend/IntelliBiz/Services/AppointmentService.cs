using IntelliBiz.API.DTOs;
using IntelliBiz.API.Models;
using IntelliBiz.API.Repositories;

namespace IntelliBiz.API.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;

        public AppointmentService(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        public async Task<AppointmentDto?> GetByIdAsync(int id)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(id);
            if (appointment == null)
                return null;

            return MapToDto(appointment);
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAsync()
        {
            var appointments = await _appointmentRepository.GetAllAsync();
            return appointments.Select(MapToDto);
        }

        public async Task<IEnumerable<AppointmentDto>> GetByUserIdAsync(int userId)
        {
            var appointments = await _appointmentRepository.GetByUserIdAsync(userId);
            return appointments.Select(MapToDto);
        }

        public async Task<IEnumerable<AppointmentDto>> GetByBusinessIdAsync(int businessId)
        {
            var appointments = await _appointmentRepository.GetByBusinessIdAsync(businessId);
            return appointments.Select(MapToDto);
        }

        public async Task<IEnumerable<AppointmentDto>> GetByStatusAsync(string status)
        {
            var appointments = await _appointmentRepository.GetByStatusAsync(status);
            return appointments.Select(MapToDto);
        }

        public async Task<ApiResponseDto<AppointmentDto>> CreateAsync(AppointmentDto appointmentDto)
        {
            var appointment = new Appointment
            {
                UserId = appointmentDto.UserId,
                BusinessId = appointmentDto.BusinessId,
                ServiceId = appointmentDto.ServiceId,
                AppointmentDate = appointmentDto.AppointmentDate,
                StartTime = TimeSpan.Parse(appointmentDto.StartTime),
                EndTime = TimeSpan.Parse(appointmentDto.EndTime),
                Status = appointmentDto.Status,
                Notes = appointmentDto.Notes,
                CreatedAt = DateTime.UtcNow
            };

            int appointmentId = await _appointmentRepository.CreateAsync(appointment);
            appointment.Id = appointmentId;

            // Retrieve the full appointment with navigation properties
            var createdAppointment = await _appointmentRepository.GetByIdAsync(appointmentId);
            if (createdAppointment == null)
            {
                return ApiResponseDto<AppointmentDto>.ErrorResponse("Failed to retrieve created appointment");
            }

            var createdAppointmentDto = MapToDto(createdAppointment);
            return ApiResponseDto<AppointmentDto>.SuccessResponse(createdAppointmentDto, "Appointment created successfully");
        }

        public async Task<ApiResponseDto<AppointmentDto>> UpdateAsync(int id, AppointmentDto appointmentDto)
        {
            var existingAppointment = await _appointmentRepository.GetByIdAsync(id);
            if (existingAppointment == null)
            {
                return ApiResponseDto<AppointmentDto>.ErrorResponse("Appointment not found");
            }

            // Update appointment properties
            existingAppointment.AppointmentDate = appointmentDto.AppointmentDate;
            existingAppointment.StartTime = TimeSpan.Parse(appointmentDto.StartTime);
            existingAppointment.EndTime = TimeSpan.Parse(appointmentDto.EndTime);
            existingAppointment.Status = appointmentDto.Status;
            existingAppointment.Notes = appointmentDto.Notes;
            existingAppointment.UpdatedAt = DateTime.UtcNow;

            bool success = await _appointmentRepository.UpdateAsync(existingAppointment);
            if (!success)
            {
                return ApiResponseDto<AppointmentDto>.ErrorResponse("Failed to update appointment");
            }

            // Retrieve the updated appointment with navigation properties
            var updatedAppointment = await _appointmentRepository.GetByIdAsync(id);
            if (updatedAppointment == null)
            {
                return ApiResponseDto<AppointmentDto>.ErrorResponse("Failed to retrieve updated appointment");
            }

            var updatedAppointmentDto = MapToDto(updatedAppointment);
            return ApiResponseDto<AppointmentDto>.SuccessResponse(updatedAppointmentDto, "Appointment updated successfully");
        }

        public async Task<ApiResponseDto<bool>> DeleteAsync(int id)
        {
            var existingAppointment = await _appointmentRepository.GetByIdAsync(id);
            if (existingAppointment == null)
            {
                return ApiResponseDto<bool>.ErrorResponse("Appointment not found");
            }

            bool success = await _appointmentRepository.DeleteAsync(id);
            if (!success)
            {
                return ApiResponseDto<bool>.ErrorResponse("Failed to delete appointment");
            }

            return ApiResponseDto<bool>.SuccessResponse(true, "Appointment deleted successfully");
        }

        public async Task<ApiResponseDto<bool>> UpdateStatusAsync(int id, string status)
        {
            var existingAppointment = await _appointmentRepository.GetByIdAsync(id);
            if (existingAppointment == null)
            {
                return ApiResponseDto<bool>.ErrorResponse("Appointment not found");
            }

            bool success = await _appointmentRepository.UpdateStatusAsync(id, status);
            if (!success)
            {
                return ApiResponseDto<bool>.ErrorResponse($"Failed to update appointment status to {status}");
            }

            return ApiResponseDto<bool>.SuccessResponse(true, $"Appointment status updated to {status} successfully");
        }

        private AppointmentDto MapToDto(Appointment appointment)
        {
            return new AppointmentDto
            {
                Id = appointment.Id,
                UserId = appointment.UserId,
                BusinessId = appointment.BusinessId,
                ServiceId = appointment.ServiceId,
                AppointmentDate = appointment.AppointmentDate,
                StartTime = appointment.StartTime.ToString(@"hh\:mm"),
                EndTime = appointment.EndTime.ToString(@"hh\:mm"),
                Status = appointment.Status,
                Notes = appointment.Notes,
                CustomerName = appointment.CustomerName,
                CustomerEmail = appointment.CustomerEmail,
                CustomerPhone = appointment.CustomerPhone,
                BusinessName = appointment.BusinessName,
                ServiceName = appointment.ServiceName
            };
        }
    }
}
