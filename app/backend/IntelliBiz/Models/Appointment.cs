using System.ComponentModel.DataAnnotations;

namespace IntelliBiz.API.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "User ID is required")]
        public int UserId { get; set; }
        
        [Required(ErrorMessage = "Business ID is required")]
        public int BusinessId { get; set; }
        
        [Required(ErrorMessage = "Service ID is required")]
        public int ServiceId { get; set; }
        
        [Required(ErrorMessage = "Appointment date is required")]
        public DateTime AppointmentDate { get; set; }
        
        [Required(ErrorMessage = "Start time is required")]
        public TimeSpan StartTime { get; set; }
        
        [Required(ErrorMessage = "End time is required")]
        public TimeSpan EndTime { get; set; }
        
        [Required(ErrorMessage = "Status is required")]
        [StringLength(20, ErrorMessage = "Status cannot exceed 20 characters")]
        public string Status { get; set; } = "pending";
        
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties for DTOs
        public string? CustomerName { get; set; }
        public string? CustomerEmail { get; set; }
        public string? CustomerPhone { get; set; }
        public string? BusinessName { get; set; }
        public string? ServiceName { get; set; }
    }
}
