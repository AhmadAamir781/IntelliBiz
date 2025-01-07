namespace IntelliBiz.Controllers
{
    using IntelliBiz.Models;
    using IntelliBiz.Repositories.Interfaces;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using System.Threading.Tasks;

    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewRepository _reviewRepository;

        public ReviewController(IReviewRepository reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        // GET: api/review/{businessId}
        [HttpGet("{businessId}")]
        public async Task<IActionResult> GetAllReviews(int businessId)
        {
            var reviews = await _reviewRepository.GetAllReviewsAsync(businessId);
            if (reviews == null)
            {
                return NotFound("No reviews found.");
            }

            return Ok(reviews);
        }

        // GET: api/review/{reviewId}
        [HttpGet("{reviewId}")]
        public async Task<IActionResult> GetReview(int reviewId)
        {
            var review = await _reviewRepository.ReadReviewAsync(reviewId);
            if (review == null)
            {
                return NotFound("Review not found.");
            }

            return Ok(review);
        }

        // POST: api/review
        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] Review review)
        {
            if (review == null)
            {
                return BadRequest("Review data is required.");
            }

            review.CreatedAt = DateTime.Now; // Set current time for CreatedAt
            var result = await _reviewRepository.CreateReviewAsync(review);

            if (result > 0)
            {
                return Ok("Review created successfully.");
            }

            return StatusCode(500, "Error creating review.");
        }

        // PUT: api/review/{reviewId}
        [HttpPut("{reviewId}")]
        public async Task<IActionResult> UpdateReview(int reviewId, [FromBody] Review review)
        {
            if (review == null || review.ReviewId != reviewId)
            {
                return BadRequest("Invalid review data.");
            }

            var result = await _reviewRepository.UpdateReviewAsync(review);

            if (result > 0)
            {
                return Ok("Review updated successfully.");
            }

            return StatusCode(500, "Error updating review.");
        }

        // DELETE: api/review/{reviewId}
        [HttpDelete("{reviewId}")]
        public async Task<IActionResult> DeleteReview(int reviewId)
        {
            var result = await _reviewRepository.DeleteReviewAsync(reviewId);

            if (result > 0)
            {
                return Ok("Review deleted successfully.");
            }

            return StatusCode(500, "Error deleting review.");
        }
    }

}
