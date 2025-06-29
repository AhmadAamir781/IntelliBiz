using IntelliBiz.API.DTOs;
using IntelliBiz.API.Models;
using IntelliBiz.API.Repositories;

namespace IntelliBiz.API.Services
{
    public class BusinessService : IBusinessService
    {
        private readonly IBusinessRepository _businessRepository;

        public BusinessService(IBusinessRepository businessRepository)
        {
            _businessRepository = businessRepository;
        }

        public async Task<BusinessDto?> GetByIdAsync(int id)
        {
            var business = await _businessRepository.GetByIdAsync(id);
            if (business == null)
                return null;

            return MapToDto(business);
        }

        public async Task<IEnumerable<BusinessDto>> GetAllAsync()
        {
            var businesses = await _businessRepository.GetAllAsync();
            return businesses.Select(MapToDto);
        }

        public async Task<IEnumerable<BusinessDto>> GetByOwnerIdAsync(int ownerId)
        {
            var businesses = await _businessRepository.GetByOwnerIdAsync(ownerId);
            return businesses.Select(MapToDto);
        }

        public async Task<IEnumerable<BusinessDto>> GetByCategoryAsync(string category)
        {
            var businesses = await _businessRepository.GetByCategoryAsync(category);
            return businesses.Select(MapToDto);
        }
        public async Task<IEnumerable<string>> GetCategoriesAsync()
        {
            var categories = await _businessRepository.GetCategoriesAsync();
            return categories;
        }
        public async Task<IEnumerable<BusinessDto>> SearchAsync(string searchTerm, string? category = null)
        {
            var businesses = await _businessRepository.SearchAsync(searchTerm, category);
            return businesses.Select(MapToDto);
        }

        public async Task<ApiResponseDto<BusinessDto>> CreateAsync(BusinessDto businessDto)
        {
            var business = new Business
            {
                OwnerId = businessDto.OwnerId,
                Name = businessDto.BusinessName,
                Category = businessDto.Category,
                Description = businessDto.Description,
                Address = businessDto.Address,
                City = businessDto.City,
                State = businessDto.State,
                ZipCode = businessDto.ZipCode,
                Phone = businessDto.PhoneNumber,
                Email = businessDto.Email,
                Website = businessDto.Website,
                IsVerified = false,
                CreatedAt = DateTime.UtcNow
            };

            int businessId = await _businessRepository.CreateAsync(business);
            business.Id = businessId;

            var createdBusinessDto = MapToDto(business);
            return ApiResponseDto<BusinessDto>.SuccessResponse(createdBusinessDto, "Business created successfully");
        }

        public async Task<ApiResponseDto<BusinessDto>> UpdateAsync(int id, BusinessDto businessDto)
        {
            var existingBusiness = await _businessRepository.GetByIdAsync(id);
            if (existingBusiness == null)
            {
                return ApiResponseDto<BusinessDto>.ErrorResponse("Business not found");
            }

            // Update business properties
            existingBusiness.Name = businessDto.BusinessName;
            existingBusiness.Category = businessDto.Category;
            existingBusiness.Description = businessDto.Description;
            existingBusiness.Address = businessDto.Address;
            existingBusiness.City = businessDto.City;
            existingBusiness.State = businessDto.State;
            existingBusiness.ZipCode = businessDto.ZipCode;
            existingBusiness.Phone = businessDto.PhoneNumber;
            existingBusiness.Email = businessDto.Email;
            existingBusiness.Website = businessDto.Website;
            existingBusiness.UpdatedAt = DateTime.UtcNow;

            bool success = await _businessRepository.UpdateAsync(existingBusiness);
            if (!success)
            {
                return ApiResponseDto<BusinessDto>.ErrorResponse("Failed to update business");
            }

            var updatedBusinessDto = MapToDto(existingBusiness);
            return ApiResponseDto<BusinessDto>.SuccessResponse(updatedBusinessDto, "Business updated successfully");
        }

        public async Task<ApiResponseDto<bool>> DeleteAsync(int id)
        {
            var existingBusiness = await _businessRepository.GetByIdAsync(id);
            if (existingBusiness == null)
            {
                return ApiResponseDto<bool>.ErrorResponse("Business not found");
            }

            bool success = await _businessRepository.DeleteAsync(id);
            if (!success)
            {
                return ApiResponseDto<bool>.ErrorResponse("Failed to delete business");
            }

            return ApiResponseDto<bool>.SuccessResponse(true, "Business deleted successfully");
        }

        public async Task<ApiResponseDto<bool>> VerifyBusinessAsync(int id)
        {
            var existingBusiness = await _businessRepository.GetByIdAsync(id);
            if (existingBusiness == null)
            {
                return ApiResponseDto<bool>.ErrorResponse("Business not found");
            }

            bool success = await _businessRepository.VerifyBusinessAsync(id);
            if (!success)
            {
                return ApiResponseDto<bool>.ErrorResponse("Failed to verify business");
            }

            return ApiResponseDto<bool>.SuccessResponse(true, "Business verified successfully");
        }

        private BusinessDto MapToDto(Business business)
        {
            return new BusinessDto
            {
                Id = business.Id,
                OwnerId = business.OwnerId,
                BusinessName = business.Name,
                Category = business.Category,
                Description = business.Description,
                Address = business.Address,
                City = business.City,
                State = business.State,
                ZipCode = business.ZipCode,
                PhoneNumber = business.Phone,
                Email = business.Email,
                Website = business.Website,
                IsVerified = business.IsVerified,
                Hours = business.Hour,
                OwnerName = business.OwnerName,
                ServiceArea = business.ServiceArea,
                CreatedAt = business.CreatedAt,
                UpdatedAt = business.UpdatedAt
            };
        }
    }
}
