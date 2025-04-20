using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using IntelliBiz.DTOs;

namespace IntelliBiz.API.Models
{
    public class Business
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Owner ID is required")]
        public int OwnerId { get; set; }

        [Required(ErrorMessage = "Business name is required")]
        [StringLength(100, ErrorMessage = "Business name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;

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
        public string? PhoneNumber { get; set; }
        public string? Founded { get; set; }
        public string? Owner { get; set; }
        public string? Employees { get; set; }
        public List<string>? Images { get; set; }
        public string? Licenses { get; set; }

        public string? PaymentMethods { get; set; } = string.Empty;

        public List<string> PaymentMethod =>
            PaymentMethods.Split(',', StringSplitOptions.RemoveEmptyEntries)
                          .Select(s => s.Trim())
                          .ToList();

        public string? ServiceAreas { 
            get;
            set; } = string.Empty;
        public List<string>? ServiceArea =>
            ServiceAreas.Split(',', StringSplitOptions.RemoveEmptyEntries)
                          .Select(s => s.Trim())
                          .ToList();
        public string? Hours { get; set; }

        public BusinessHoursDto Hour =>
    string.IsNullOrWhiteSpace(Hours)
        ? new BusinessHoursDto()
        : JsonSerializer.Deserialize<BusinessHoursDto>(Hours) ?? new BusinessHoursDto();


        public bool IsVerified { get; set; }
        public int ViewCount { get; set; }
        public int Rating { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
