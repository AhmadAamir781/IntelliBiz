using System.ComponentModel.DataAnnotations;

namespace IntelliBiz.Models;

public class ChatRoom
{
    public int ChatRoomId { get; set; }
    public int BusinessId { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastMessageAt { get; set; }

    // Navigation properties
    public Business? Business { get; set; }
    public User? User { get; set; }
    public List<ChatMessage> Messages { get; set; } = new();
}

public class ChatMessage
{
    public int MessageId { get; set; }
    public int ChatRoomId { get; set; }
    public int SenderId { get; set; }

    [Required]
    [MaxLength(4000)]
    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ChatRoom? ChatRoom { get; set; }
    public User? Sender { get; set; }
}

public class ChatRoomResponse
{
    public int ChatRoomId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastMessageAt { get; set; }
    public string BusinessName { get; set; } = string.Empty;
    public string BusinessAddress { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
}

public class ChatMessageResponse
{
    public int MessageId { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string SenderEmail { get; set; } = string.Empty;
}

public class CreateChatMessageRequest
{
    [Required]
    [MaxLength(4000)]
    public string Message { get; set; } = string.Empty;
} 