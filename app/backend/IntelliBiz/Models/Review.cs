using System.ComponentModel.DataAnnotations;

namespace IntelliBiz.API.Models
{
    public class Review
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "User ID is required")]
        public int UserId { get; set; }
        
        [Required(ErrorMessage = "Business ID is required")]
        public int BusinessId { get; set; }
        
        [Required(ErrorMessage = "Rating is required")]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }
        
        [Required(ErrorMessage = "Comment is required")]
        public string Comment { get; set; } = string.Empty;
        
        public bool IsFlagged { get; set; }
        
        public string? FlagReason { get; set; }
        
        [Required(ErrorMessage = "Status is required")]
        [StringLength(20, ErrorMessage = "Status cannot exceed 20 characters")]
        public string Status { get; set; } = "published";
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties for DTOs
        public string? UserName { get; set; }
        public string? UserAvatar { get; set; }
        public string? BusinessName { get; set; }
    }
}
