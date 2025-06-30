using System;
using System.ComponentModel.DataAnnotations;

namespace IntelliBiz.API.Models
{
    public class PasswordResetToken
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        [Required]
        public string Token { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
        public virtual User User { get; set; } = null!;
    }
} 