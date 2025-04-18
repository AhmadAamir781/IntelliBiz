using System.ComponentModel.DataAnnotations;

namespace IntelliBiz.API.DTOs
{
    public class MessageDto
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Sender ID is required")]
        public int SenderId { get; set; }
        [Required(ErrorMessage = "Business ID is required")]
        public int BusinessId { get; set; }
        [Required(ErrorMessage = "User ID is required")]
        public int UserId { get; set; }
        
        [Required(ErrorMessage = "Receiver ID is required")]
        public int ReceiverId { get; set; }
        
        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; } = string.Empty;
        
        public bool IsRead { get; set; }
        public bool IsFromBusiness { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public string? SenderName { get; set; }
        
        public string? ReceiverName { get; set; }
        
        public string? SenderAvatar { get; set; }
        
        public string? ReceiverAvatar { get; set; }
    }
}
