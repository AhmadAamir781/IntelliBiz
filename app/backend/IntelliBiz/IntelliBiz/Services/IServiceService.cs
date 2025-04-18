using IntelliBiz.API.DTOs;

namespace IntelliBiz.API.Services
{
    public interface IServiceService
    {
        Task<ServiceDto?> GetByIdAsync(int id);
        Task<IEnumerable<ServiceDto>> GetAllAsync();
        Task<IEnumerable<ServiceDto>> GetByBusinessIdAsync(int businessId);
        Task<ApiResponseDto<ServiceDto>> CreateAsync(ServiceDto serviceDto);
        Task<ApiResponseDto<ServiceDto>> UpdateAsync(int id, ServiceDto serviceDto);
        Task<ApiResponseDto<bool>> DeleteAsync(int id);
        Task<ApiResponseDto<bool>> ToggleActiveStatusAsync(int id);
    }
}
