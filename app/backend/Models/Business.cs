using System.ComponentModel.DataAnnotations;

namespace IntelliBiz.API.Models;

public class Business
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [Range(0, 5)]
    public decimal Rating { get; set; }

    [Range(0, int.MaxValue)]
    public int ReviewCount { get; set; }

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Image { get; set; } = string.Empty;

    public bool Verified { get; set; }
}

public class CreateBusinessRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [Range(0, 5)]
    public decimal Rating { get; set; }

    [Range(0, int.MaxValue)]
    public int ReviewCount { get; set; }

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Image { get; set; } = string.Empty;

    public bool Verified { get; set; }
}

public class UpdateBusinessRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [Range(0, 5)]
    public decimal Rating { get; set; }

    [Range(0, int.MaxValue)]
    public int ReviewCount { get; set; }

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Image { get; set; } = string.Empty;

    public bool Verified { get; set; }
}

public class BusinessSearchRequest
{
    public string? SearchTerm { get; set; }
    public string? Category { get; set; }
    public string SortBy { get; set; } = "name";
    public string SortDirection { get; set; } = "asc";
} 