using IntelliBiz.API.DTOs;

namespace IntelliBiz.API.Services
{
    public interface IBusinessService
    {
        Task<BusinessDto?> GetByIdAsync(int id);
        Task<IEnumerable<BusinessDto>> GetAllAsync();
        Task<IEnumerable<BusinessDto>> GetByOwnerIdAsync(int ownerId);
        Task<IEnumerable<BusinessDto>> GetByCategoryAsync(string category);
        Task<IEnumerable<string>> GetCategoriesAsync();
        Task<IEnumerable<BusinessDto>> SearchAsync(string searchTerm, string? category = null);
        Task<ApiResponseDto<BusinessDto>> CreateAsync(BusinessDto businessDto);
        Task<ApiResponseDto<BusinessDto>> UpdateAsync(int id, BusinessDto businessDto);
        Task<ApiResponseDto<bool>> DeleteAsync(int id);
        Task<ApiResponseDto<bool>> VerifyBusinessAsync(int id);
    }
}
