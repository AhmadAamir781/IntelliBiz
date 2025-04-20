using System.ComponentModel.DataAnnotations;
using IntelliBiz.DTOs;
using System.Text.Json;

namespace IntelliBiz.API.DTOs
{
    public class BusinessDto
    {
        public int Id { get; set; }
        
        public int OwnerId { get; set; }
        
        [Required(ErrorMessage = "Business name is required")]
        [StringLength(100, ErrorMessage = "Business name cannot exceed 100 characters")]
        public string BusinessName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Category is required")]
        [StringLength(50, ErrorMessage = "Category cannot exceed 50 characters")]
        public string Category { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Description is required")]
        [MinLength(50, ErrorMessage = "Description should be at least 50 characters")]
        public string Description { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Address is required")]
        [StringLength(255, ErrorMessage = "Address cannot exceed 255 characters")]
        public string Address { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "City is required")]
        [StringLength(100, ErrorMessage = "City cannot exceed 100 characters")]
        public string City { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "State is required")]
        [StringLength(50, ErrorMessage = "State cannot exceed 50 characters")]
        public string State { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "ZIP code is required")]
        [StringLength(20, ErrorMessage = "ZIP code cannot exceed 20 characters")]
        public string ZipCode { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number")]
        [StringLength(20, ErrorMessage = "Phone number cannot exceed 20 characters")]
        public string Phone { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        public string Email { get; set; } = string.Empty;
        
        [Url(ErrorMessage = "Invalid website URL")]
        [StringLength(255, ErrorMessage = "Website URL cannot exceed 255 characters")]
        public string? Website { get; set; }
        
        public bool IsVerified { get; set; }
        
        public BusinessHoursDto? Hours {get; set;}
        public List<string>? ServiceArea {get;set;}
        public string? OwnerName { get; set; }
    }
}
