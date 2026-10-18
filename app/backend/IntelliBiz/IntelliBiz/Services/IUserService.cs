using IntelliBiz.DTOs;

namespace IntelliBiz.Services
{
    public interface IUserService
    {
        Task<UserDto?> GetByIdAsync(int id);
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto?> GetByEmailAsync(string email);
        Task<IEnumerable<UserDto>> GetByRoleAsync(string role);
        Task<ApiResponseDto<UserDto>> UpdateAsync(int id, UserDto userDto);
        Task<ApiResponseDto<bool>> DeleteAsync(int id);
    }
}
