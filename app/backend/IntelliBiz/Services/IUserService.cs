using IntelliBiz.API.DTOs;
using IntelliBiz.API.Models;

namespace IntelliBiz.API.Services
{
    public interface IUserService
    {
        Task<UserDto?> GetByIdAsync(int id);
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<IEnumerable<UserDto>> GetByRoleAsync(string role);
        Task<ApiResponseDto<UserDto>> UpdateAsync(int id, UserDto userDto);
        Task<ApiResponseDto<bool>> DeleteAsync(int id);
    }
}
