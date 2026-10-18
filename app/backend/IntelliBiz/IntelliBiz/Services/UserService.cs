using IntelliBiz.DTOs;
using IntelliBiz.Models;
using IntelliBiz.Repositories;

namespace IntelliBiz.Services
{
    public class UserService(IUserRepository userRepository) : IUserService
    {
        public async Task<UserDto?> GetByIdAsync(int id)
        {
            var user = await userRepository.GetByIdAsync(id);
            if (user == null)
                return null;

            return MapToDto(user);
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            var users = await userRepository.GetAllAsync();
            return users.Select(MapToDto);
        }

        public async Task<IEnumerable<UserDto>> GetByRoleAsync(string role)
        {
            var users = await userRepository.GetByRoleAsync(role);
            return users.Select(MapToDto);
        }

        public async Task<UserDto?> GetByEmailAsync(string email)
        {
            var user = await userRepository.GetByEmailAsync(email);
            return user is not null ? MapToDto(user) : null;
        }

        public async Task<ApiResponseDto<UserDto>> UpdateAsync(int id, UserDto userDto)
        {
            var existingUser = await userRepository.GetByIdAsync(id);
            if (existingUser == null)
            {
                return ApiResponseDto<UserDto>.ErrorResponse("User not found");
            }

            // Check if email is being changed and if it already exists
            if (existingUser.Email != userDto.Email && await userRepository.EmailExistsAsync(userDto.Email))
            {
                return ApiResponseDto<UserDto>.ErrorResponse("Email already exists");
            }

            // Update user properties
            existingUser.FirstName = userDto.FirstName;
            existingUser.LastName = userDto.LastName;
            existingUser.Email = userDto.Email;
            existingUser.Role = userDto.Role;
            existingUser.UpdatedAt = DateTime.UtcNow;

            bool success = await userRepository.UpdateAsync(existingUser);
            if (!success)
            {
                return ApiResponseDto<UserDto>.ErrorResponse("Failed to update user");
            }

            return ApiResponseDto<UserDto>.SuccessResponse(userDto, "User updated successfully");
        }

        public async Task<ApiResponseDto<bool>> DeleteAsync(int id)
        {
            var existingUser = await userRepository.GetByIdAsync(id);
            if (existingUser == null)
            {
                return ApiResponseDto<bool>.ErrorResponse("User not found");
            }

            bool success = await userRepository.DeleteAsync(id);
            if (!success)
            {
                return ApiResponseDto<bool>.ErrorResponse("Failed to delete user");
            }

            return ApiResponseDto<bool>.SuccessResponse(true, "User deleted successfully");
        }

        private UserDto MapToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
