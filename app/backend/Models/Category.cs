using System.ComponentModel.DataAnnotations;

namespace IntelliBiz.API.Models;

public class Category
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Icon { get; set; } = string.Empty;
    
    public bool IsActive { get; set; } = true;
} 