using IntelliBiz.API.DTOs;
using IntelliBiz.API.Models;
using IntelliBiz.API.Repositories;

namespace IntelliBiz.API.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;

        public ReviewService(IReviewRepository reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        public async Task<ReviewDto?> GetByIdAsync(int id)
        {
            var review = await _reviewRepository.GetByIdAsync(id);
            if (review == null)
                return null;

            return MapToDto(review);
        }

        public async Task<IEnumerable<ReviewDto>> GetAllAsync()
        {
            var reviews = await _reviewRepository.GetAllAsync();
            return reviews.Select(MapToDto);
        }

        public async Task<IEnumerable<ReviewDto>> GetByUserIdAsync(int userId)
        {
            var reviews = await _reviewRepository.GetByUserIdAsync(userId);
            return reviews.Select(MapToDto);
        }

        public async Task<IEnumerable<ReviewDto>> GetByBusinessIdAsync(int businessId)
        {
            var reviews = await _reviewRepository.GetByBusinessIdAsync(businessId);
            return reviews.Select(MapToDto);
        }

        public async Task<IEnumerable<ReviewDto>> GetByStatusAsync(string status)
        {
            var reviews = await _reviewRepository.GetByStatusAsync(status);
            return reviews.Select(MapToDto);
        }

        public async Task<IEnumerable<ReviewDto>> GetFlaggedAsync()
        {
            var reviews = await _reviewRepository.GetFlaggedAsync();
            return reviews.Select(MapToDto);
        }

        public async Task<ApiResponseDto<ReviewDto>> CreateAsync(ReviewDto reviewDto)
        {
            var review = new Review
            {
                UserId = reviewDto.UserId,
                BusinessId = reviewDto.BusinessId,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                IsFlagged = false,
                Status = "published",
                CreatedAt = DateTime.UtcNow
            };

            int reviewId = await _reviewRepository.CreateAsync(review);
            review.Id = reviewId;

            // Retrieve the full review with navigation properties
            var createdReview = await _reviewRepository.GetByIdAsync(reviewId);
            if (createdReview == null)
            {
                return ApiResponseDto<ReviewDto>.ErrorResponse("Failed to retrieve created review");
            }

            var createdReviewDto = MapToDto(createdReview);
            return ApiResponseDto<ReviewDto>.SuccessResponse(createdReviewDto, "Review created successfully");
        }

        public async Task<ApiResponseDto<ReviewDto>> UpdateAsync(int id, ReviewDto reviewDto)
        {
            var existingReview = await _reviewRepository.GetByIdAsync(id);
            if (existingReview == null)
            {
                return ApiResponseDto<ReviewDto>.ErrorResponse("Review not found");
            }

            // Update review properties
            existingReview.Rating = reviewDto.Rating;
            existingReview.Comment = reviewDto.Comment;
            existingReview.UpdatedAt = DateTime.UtcNow;

            bool success = await _reviewRepository.UpdateAsync(existingReview);
            if (!success)
            {
                return ApiResponseDto<ReviewDto>.ErrorResponse("Failed to update review");
            }

            // Retrieve the updated review with navigation properties
            var updatedReview = await _reviewRepository.GetByIdAsync(id);
            if (updatedReview == null)
            {
                return ApiResponseDto<ReviewDto>.ErrorResponse("Failed to retrieve updated review");
            }

            var updatedReviewDto = MapToDto(updatedReview);
            return ApiResponseDto<ReviewDto>.SuccessResponse(updatedReviewDto, "Review updated successfully");
        }

        public async Task<ApiResponseDto<bool>> DeleteAsync(int id)
        {
            var existingReview = await _reviewRepository.GetByIdAsync(id);
            if (existingReview == null)
            {
                return ApiResponseDto<bool>.ErrorResponse("Review not found");
            }

            bool success = await _reviewRepository.DeleteAsync(id);
            if (!success)
            {
                return ApiResponseDto<bool>.ErrorResponse("Failed to delete review");
            }

            return ApiResponseDto<bool>.SuccessResponse(true, "Review deleted successfully");
        }

        public async Task<ApiResponseDto<bool>> FlagReviewAsync(int id, string flagReason)
        {
            var existingReview = await _reviewRepository.GetByIdAsync(id);
            if (existingReview == null)
            {
                return ApiResponseDto<bool>.ErrorResponse("Review not found");
            }

            bool success = await _reviewRepository.FlagReviewAsync(id, flagReason);
            if (!success)
            {
                return ApiResponseDto<bool>.ErrorResponse("Failed to flag review");
            }

            return ApiResponseDto<bool>.SuccessResponse(true, "Review flagged successfully");
        }

        public async Task<ApiResponseDto<bool>> UnflagReviewAsync(int id)
        {
            var existingReview = await _reviewRepository.GetByIdAsync(id);
            if (existingReview == null)
            {
                return ApiResponseDto<bool>.ErrorResponse("Review not found");
            }

            bool success = await _reviewRepository.UnflagReviewAsync(id);
            if (!success)
            {
                return ApiResponseDto<bool>.ErrorResponse("Failed to unflag review");
            }

            return ApiResponseDto<bool>.SuccessResponse(true, "Review unflagged successfully");
        }

        public async Task<ApiResponseDto<bool>> UpdateStatusAsync(int id, string status)
        {
            var existingReview = await _reviewRepository.GetByIdAsync(id);
            if (existingReview == null)
            {
                return ApiResponseDto<bool>.ErrorResponse("Review not found");
            }

            bool success = await _reviewRepository.UpdateStatusAsync(id, status);
            if (!success)
            {
                return ApiResponseDto<bool>.ErrorResponse($"Failed to update review status to {status}");
            }

            return ApiResponseDto<bool>.SuccessResponse(true, $"Review status updated to {status} successfully");
        }

        private ReviewDto MapToDto(Review review)
        {
            return new ReviewDto
            {
                Id = review.Id,
                UserId = review.UserId,
                BusinessId = review.BusinessId,
                Rating = review.Rating,
                Comment = review.Comment,
                IsFlagged = review.IsFlagged,
                FlagReason = review.FlagReason,
                Status = review.Status,
                CreatedAt = review.CreatedAt,
                UserName = review.UserName,
                UserAvatar = review.UserAvatar,
                BusinessName = review.BusinessName
            };
        }

        public async Task<IEnumerable<ReviewDto>> GetPendingReviewsAsync()
        {
            var reviews = await _reviewRepository.GetByStatusAsync("pending");
            return reviews.Select(MapToDto);
        }

        public async Task<IEnumerable<ReviewDto>> GetFlaggedReviewsAsync()
        {
            var reviews = await _reviewRepository.GetFlaggedAsync();
            return reviews.Select(MapToDto);
        }

        public async Task<ApiResponseDto<bool>> ApproveReviewAsync(int id)
        {
            var existingReview = await _reviewRepository.GetByIdAsync(id);
            if (existingReview == null)
            {
                return ApiResponseDto<bool>.ErrorResponse("Review not found");
            }

            bool success = await _reviewRepository.UpdateStatusAsync(id, "published");
            if (!success)
            {
                return ApiResponseDto<bool>.ErrorResponse("Failed to approve review");
            }

            return ApiResponseDto<bool>.SuccessResponse(true, "Review approved successfully");
        }

        public async Task<ApiResponseDto<bool>> RejectReviewAsync(int id)
        {
            var existingReview = await _reviewRepository.GetByIdAsync(id);
            if (existingReview == null)
            {
                return ApiResponseDto<bool>.ErrorResponse("Review not found");
            }

            bool success = await _reviewRepository.UpdateStatusAsync(id, "rejected");
            if (!success)
            {
                return ApiResponseDto<bool>.ErrorResponse("Failed to reject review");
            }

            return ApiResponseDto<bool>.SuccessResponse(true, "Review rejected successfully");
        }

    }
}
