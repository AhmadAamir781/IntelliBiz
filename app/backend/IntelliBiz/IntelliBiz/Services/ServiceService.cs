using IntelliBiz.DTOs;
using IntelliBiz.Models;
using IntelliBiz.Repositories;

namespace IntelliBiz.Services
{
    public class ServiceService(IServiceRepository serviceRepository) : IServiceService
    {
        public async Task<ServiceDto?> GetByIdAsync(int id)
        {
            var service = await serviceRepository.GetByIdAsync(id);
            if (service == null)
                return null;

            return MapToDto(service);
        }

        public async Task<IEnumerable<ServiceDto>> GetAllAsync()
        {
            var services = await serviceRepository.GetAllAsync();
            return services.Select(MapToDto);
        }

        public async Task<IEnumerable<ServiceDto>> GetByBusinessIdAsync(int businessId)
        {
            var services = await serviceRepository.GetByBusinessIdAsync(businessId);
            return services.Select(MapToDto);
        }

        public async Task<ApiResponseDto<ServiceDto>> CreateAsync(ServiceDto serviceDto)
        {
            var service = new Service
            {
                BusinessId = serviceDto.BusinessId,
                Name = serviceDto.Name,
                Description = serviceDto.Description,
                Price = serviceDto.Price,
                Duration = serviceDto.Duration,
                IsActive = serviceDto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            int serviceId = await serviceRepository.CreateAsync(service);
            service.Id = serviceId;

            var createdServiceDto = MapToDto(service);
            return ApiResponseDto<ServiceDto>.SuccessResponse(createdServiceDto, "Service created successfully");
        }

        public async Task<ApiResponseDto<ServiceDto>> UpdateAsync(int id, ServiceDto serviceDto)
        {
            var existingService = await serviceRepository.GetByIdAsync(id);
            if (existingService == null)
            {
                return ApiResponseDto<ServiceDto>.ErrorResponse("Service not found");
            }

            // Update service properties
            existingService.Name = serviceDto.Name;
            existingService.Description = serviceDto.Description;
            existingService.Price = serviceDto.Price;
            existingService.Duration = serviceDto.Duration;
            existingService.IsActive = serviceDto.IsActive;
            existingService.UpdatedAt = DateTime.UtcNow;

            bool success = await serviceRepository.UpdateAsync(existingService);
            if (!success)
            {
                return ApiResponseDto<ServiceDto>.ErrorResponse("Failed to update service");
            }

            var updatedServiceDto = MapToDto(existingService);
            return ApiResponseDto<ServiceDto>.SuccessResponse(updatedServiceDto, "Service updated successfully");
        }

        public async Task<ApiResponseDto<bool>> DeleteAsync(int id)
        {
            var existingService = await serviceRepository.GetByIdAsync(id);
            if (existingService == null)
            {
                return ApiResponseDto<bool>.ErrorResponse("Service not found");
            }

            bool success = await serviceRepository.DeleteAsync(id);
            if (!success)
            {
                return ApiResponseDto<bool>.ErrorResponse("Failed to delete service");
            }

            return ApiResponseDto<bool>.SuccessResponse(true, "Service deleted successfully");
        }

        public async Task<ApiResponseDto<bool>> ToggleActiveStatusAsync(int id)
        {
            var existingService = await serviceRepository.GetByIdAsync(id);
            if (existingService == null)
            {
                return ApiResponseDto<bool>.ErrorResponse("Service not found");
            }

            bool success = await serviceRepository.ToggleActiveStatusAsync(id);
            if (!success)
            {
                return ApiResponseDto<bool>.ErrorResponse("Failed to toggle service status");
            }

            return ApiResponseDto<bool>.SuccessResponse(true, "Service status toggled successfully");
        }

        private ServiceDto MapToDto(Service service)
        {
            return new ServiceDto
            {
                Id = service.Id,
                BusinessId = service.BusinessId,
                Name = service.Name,
                Description = service.Description,
                Price = service.Price,
                Duration = service.Duration,
                IsActive = service.IsActive,
                BusinessName = service.BusinessName
            };
        }
    }
}
