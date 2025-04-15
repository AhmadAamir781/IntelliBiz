using System.ComponentModel.DataAnnotations;

namespace IntelliBiz.API.DTOs
{
    public class ServiceDto
    {
        public int Id { get; set; }
        
        public int BusinessId { get; set; }
        
        [Required(ErrorMessage = "Service name is required")]
        [StringLength(100, ErrorMessage = "Service name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, 10000, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }
        
        [Required(ErrorMessage = "Duration is required")]
        [Range(1, 1440, ErrorMessage = "Duration must be between 1 and 1440 minutes")]
        public int Duration { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public string? BusinessName { get; set; }
    }
}
