namespace IntelliBiz.API.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int ConversationId { get; set; }
        public int SenderId { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties (not stored in DB)
        public string Username { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }

    public class Conversation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int BusinessId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties (not stored in DB)
        public string UserUsername { get; set; } = string.Empty;
        public string UserFirstName { get; set; } = string.Empty;
        public string UserLastName { get; set; } = string.Empty;
        public string BusinessName { get; set; } = string.Empty;
        public string BusinessLogoUrl { get; set; } = string.Empty;
        public int UnreadCount { get; set; }
        public string LastMessage { get; set; } = string.Empty;
        public DateTime? LastMessageDate { get; set; }
    }
}