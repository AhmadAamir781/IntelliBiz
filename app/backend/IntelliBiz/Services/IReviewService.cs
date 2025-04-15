using IntelliBiz.API.DTOs;

namespace IntelliBiz.API.Services
{
    public interface IReviewService
    {
        Task<ReviewDto?> GetByIdAsync(int id);
        Task<IEnumerable<ReviewDto>> GetAllAsync();
        Task<IEnumerable<ReviewDto>> GetByUserIdAsync(int userId);
        Task<IEnumerable<ReviewDto>> GetByBusinessIdAsync(int businessId);
        Task<IEnumerable<ReviewDto>> GetByStatusAsync(string status);
        Task<IEnumerable<ReviewDto>> GetFlaggedAsync();
        Task<ApiResponseDto<ReviewDto>> CreateAsync(ReviewDto reviewDto);
        Task<ApiResponseDto<ReviewDto>> UpdateAsync(int id, ReviewDto reviewDto);
        Task<ApiResponseDto<bool>> DeleteAsync(int id);
        Task<ApiResponseDto<bool>> FlagReviewAsync(int id, string flagReason);
        Task<ApiResponseDto<bool>> UnflagReviewAsync(int id);
        Task<ApiResponseDto<bool>> UpdateStatusAsync(int id, string status);
        Task<IEnumerable<ReviewDto>> GetPendingReviewsAsync();
        Task<IEnumerable<ReviewDto>> GetFlaggedReviewsAsync();
        Task<ApiResponseDto<bool>> ApproveReviewAsync(int id);
        Task<ApiResponseDto<bool>> RejectReviewAsync(int id);

    }
}
