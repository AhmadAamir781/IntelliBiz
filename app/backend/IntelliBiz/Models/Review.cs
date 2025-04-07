namespace IntelliBiz.API.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int BusinessId { get; set; }
        public int UserId { get; set; }
        public int Rating { get; set; } // 1-5
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties (not stored in DB)
        public string Username { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string BusinessName { get; set; } = string.Empty;
    }
}