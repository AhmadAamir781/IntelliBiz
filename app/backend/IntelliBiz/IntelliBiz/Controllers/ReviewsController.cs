using IntelliBiz.DTOs;
using IntelliBiz.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IntelliBiz.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController(IReviewService reviewService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetAll()
        {
            var reviews = await reviewService.GetAllAsync();
            return Ok(reviews);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewDto>> GetById(int id)
        {
            var review = await reviewService.GetByIdAsync(id);
            if (review == null)
            {
                return NotFound(new { message = "Review not found" });
            }

            return Ok(review);
        }

        [HttpGet("business/{businessId}")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetByBusinessId(int businessId)
        {
            var reviews = await reviewService.GetByBusinessIdAsync(businessId);
            return Ok(reviews);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetByUserId(int userId)
        {
            // Check if user is requesting their own reviews or is an admin
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (currentUserId != userId && userRole != "Admin")
            {
                return Forbid();
            }

            var reviews = await reviewService.GetByUserIdAsync(userId);
            return Ok(reviews);
        }

        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetPendingReviews()
        {
            var reviews = await reviewService.GetPendingReviewsAsync();
            return Ok(reviews);
        }

        [HttpGet("flagged")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetFlaggedReviews()
        {
            var reviews = await reviewService.GetFlaggedReviewsAsync();
            return Ok(reviews);
        }

        [HttpGet("published")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetPublishedReviews()
        {
            var reviews = await reviewService.GetByStatusAsync("published");
            return Ok(reviews);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<ReviewDto>>> Create([FromBody] ReviewDto reviewDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponseDto<ReviewDto>.ErrorResponse("Invalid review data"));
            }

            // Set user ID from the authenticated user
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            reviewDto.UserId = userId;

            var response = await reviewService.CreateAsync(reviewDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return CreatedAtAction(nameof(GetById), new { id = response.Data.Id }, response);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponseDto<ReviewDto>>> Update(int id, [FromBody] ReviewDto reviewDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponseDto<ReviewDto>.ErrorResponse("Invalid review data"));
            }

            // Check if user is the author of the review or an admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var review = await reviewService.GetByIdAsync(id);

            if (review == null)
            {
                return NotFound(ApiResponseDto<ReviewDto>.ErrorResponse("Review not found"));
            }

            if (review.UserId != userId && userRole != "Admin")
            {
                return Forbid();
            }

            var response = await reviewService.UpdateAsync(id, reviewDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            // Check if user is the author of the review or an admin
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var review = await reviewService.GetByIdAsync(id);

            if (review == null)
            {
                return NotFound(ApiResponseDto<bool>.ErrorResponse("Review not found"));
            }

            if (review.UserId != userId && userRole != "Admin")
            {
                return Forbid();
            }

            var response = await reviewService.DeleteAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpPatch("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponseDto<bool>>> ApproveReview(int id)
        {
            var response = await reviewService.ApproveReviewAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpPatch("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponseDto<bool>>> RejectReview(int id)
        {
            var response = await reviewService.RejectReviewAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpPatch("{id}/flag")]
        [Authorize]
        public async Task<ActionResult<ApiResponseDto<bool>>> FlagReview(int id)
        {
            var response = await reviewService.FlagReviewAsync(id, "no reason");
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpPatch("{id}/unflag")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponseDto<bool>>> UnflagReview(int id)
        {
            var response = await reviewService.UnflagReviewAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
    }
}
