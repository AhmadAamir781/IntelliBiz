namespace IntelliBiz.API.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public int BusinessId { get; set; }
        public int UserId { get; set; }
        public int? ServiceId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string Notes { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Completed, Cancelled
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties (not stored in DB)
        public string Username { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string BusinessName { get; set; } = string.Empty;
        public string BusinessAddress { get; set; } = string.Empty;
        public string BusinessCity { get; set; } = string.Empty;
        public string ServiceName { get; set; } = string.Empty;
        public decimal ServicePrice { get; set; }
        public int ServiceDuration { get; set; }
    }
}