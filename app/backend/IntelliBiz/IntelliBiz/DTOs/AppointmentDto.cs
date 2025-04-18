using System.ComponentModel.DataAnnotations;

namespace IntelliBiz.API.DTOs
{
    public class AppointmentDto
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
        public string StartTime { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "End time is required")]
        public string EndTime { get; set; } = string.Empty;
        
        public string Status { get; set; } = "pending";
        
        public string? Notes { get; set; }
        
        public string? CustomerName { get; set; }
        
        public string? CustomerEmail { get; set; }
        
        public string? CustomerPhone { get; set; }
        
        public string? BusinessName { get; set; }
        
        public string? ServiceName { get; set; }
    }
}
