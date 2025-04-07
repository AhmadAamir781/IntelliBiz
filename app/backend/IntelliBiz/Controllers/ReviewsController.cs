using IntelliBiz.API.Models;
using IntelliBiz.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IntelliBiz.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IBusinessRepository _businessRepository;
        private readonly ILogger<ReviewsController> _logger;

        public ReviewsController(
            IReviewRepository reviewRepository,
            IBusinessRepository businessRepository,
            ILogger<ReviewsController> logger)
        {
            _reviewRepository = reviewRepository;
            _businessRepository = businessRepository;
            _logger = logger;
        }

        // GET: api/reviews/business/{businessId}
        [HttpGet("business/{businessId}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetBusinessReviews(int businessId)
        {
            try
            {
                var business = await _businessRepository.GetBusinessByIdAsync(businessId);
                if (business == null)
                {
                    return NotFound($"Business with ID {businessId} not found");
                }

                var reviews = await _reviewRepository.GetReviewsByBusinessIdAsync(businessId);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving reviews for business {BusinessId}", businessId);
                return StatusCode(500, "An error occurred while retrieving reviews");
            }
        }

        // GET: api/reviews/user
        [HttpGet("user")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Review>>> GetUserReviews()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var reviews = await _reviewRepository.GetReviewsByUserIdAsync(userId);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user reviews");
                return StatusCode(500, "An error occurred while retrieving reviews");
            }
        }

        // GET: api/reviews/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReview(int id)
        {
            try
            {
                var review = await _reviewRepository.GetReviewByIdAsync(id);

                if (review == null)
                {
                    return NotFound($"Review with ID {id} not found");
                }

                return Ok(review);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving review with ID {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the review");
            }
        }

        // POST: api/reviews
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Review>> CreateReview(Review review)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var business = await _businessRepository.GetBusinessByIdAsync(review.BusinessId);
                if (business == null)
                {
                    return NotFound($"Business with ID {review.BusinessId} not found");
                }

                // Check if user has already reviewed this business
                var existingReview = await _reviewRepository.GetReviewByUserAndBusinessAsync(userId, review.BusinessId);
                if (existingReview != null)
                {
                    return BadRequest("You have already reviewed this business");
                }

                // Validate rating
                if (review.Rating < 1 || review.Rating > 5)
                {
                    return BadRequest("Rating must be between 1 and 5");
                }

                review.UserId = userId;
                review.CreatedAt = DateTime.UtcNow;

                var id = await _reviewRepository.CreateReviewAsync(review);
                review.Id = id;

                return CreatedAtAction(nameof(GetReview), new { id }, review);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating review");
                return StatusCode(500, "An error occurred while creating the review");
            }
        }

        // PUT: api/reviews/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateReview(int id, Review review)
        {
            try
            {
                if (id != review.Id)
                {
                    return BadRequest("ID in URL does not match ID in request body");
                }

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var existingReview = await _reviewRepository.GetReviewByIdAsync(id);
                if (existingReview == null)
                {
                    return NotFound($"Review with ID {id} not found");
                }

                // Check if user is the author of the review or an admin
                if (existingReview.UserId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to update this review");
                }

                // Validate rating
                if (review.Rating < 1 || review.Rating > 5)
                {
                    return BadRequest("Rating must be between 1 and 5");
                }

                review.UserId = existingReview.UserId;
                review.BusinessId = existingReview.BusinessId;
                review.CreatedAt = existingReview.CreatedAt;
                review.UpdatedAt = DateTime.UtcNow;

                var success = await _reviewRepository.UpdateReviewAsync(review);

                if (!success)
                {
                    return StatusCode(500, "Failed to update review");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating review with ID {Id}", id);
                return StatusCode(500, "An error occurred while updating the review");
            }
        }

        // DELETE: api/reviews/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteReview(int id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token");
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid user ID format");
                }

                var existingReview = await _reviewRepository.GetReviewByIdAsync(id);
                if (existingReview == null)
                {
                    return NotFound($"Review with ID {id} not found");
                }

                // Check if user is the author of the review or an admin
                if (existingReview.UserId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid("You don't have permission to delete this review");
                }

                var success = await _reviewRepository.DeleteReviewAsync(id);

                if (!success)
                {
                    return StatusCode(500, "Failed to delete review");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting review with ID {Id}", id);
                return StatusCode(500, "An error occurred while deleting the review");
            }
        }
    }
}