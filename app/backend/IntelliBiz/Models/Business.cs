using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Annotations;

namespace IntelliBiz.Models
{
    public class Business
    {
        [SwaggerIgnore]
        public int BusinessId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 1, ErrorMessage = "Name is required and cannot exceed 255 characters.")]
        public string Name { get; set; }

        [Required]
        [StringLength(int.MaxValue, MinimumLength = 10, ErrorMessage = "Description is required and must have at least 10 characters.")]
        public string Description { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Category cannot exceed 100 characters.")]
        public string Category { get; set; }

        [Required]
        [RegularExpression(@"^[0-9+\-()]*$", ErrorMessage = "Invalid contact number.")]
        [StringLength(20, MinimumLength = 10, ErrorMessage = "Contact number should be between 10 to 20 characters.")]
        public string ContactNumber { get; set; }

        [RegularExpression(@"^[0-9+\-()]*$", ErrorMessage = "Invalid WhatsApp number.")]
        [StringLength(20, MinimumLength = 10, ErrorMessage = "WhatsApp number should be between 10 to 20 characters.")]
        public string Whatsapp { get; set; }

        [Required]
        [StringLength(1000, ErrorMessage = "Address cannot exceed 1000 characters.")]
        public string Address { get; set; }

        [Required]
        [StringLength(1000, ErrorMessage = "Business hours cannot exceed 1000 characters.")]
        public string BusinessHours { get; set; }

        [StringLength(1000, ErrorMessage = "Photos cannot exceed 1000 characters.")]
        public string Photos { get; set; }
    }

}
