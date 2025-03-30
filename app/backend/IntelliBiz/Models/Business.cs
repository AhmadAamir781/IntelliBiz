using System.ComponentModel.DataAnnotations;

namespace IntelliBiz.Models;

public class Business
{
    public int BusinessId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public int CategoryId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Website { get; set; }

    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public bool IsVerified { get; set; }
    public int CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public Category? Category { get; set; }
    public List<BusinessImage> Images { get; set; } = new();
    public List<BusinessHour> Hours { get; set; } = new();
    public List<Review> Reviews { get; set; } = new();
}

public class Category
{
    public int CategoryId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(50)]
    public string? Icon { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class BusinessImage
{
    public int ImageId { get; set; }
    public int BusinessId { get; set; }

    [Required]
    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    public bool IsMain { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class BusinessHour
{
    public int BusinessHoursId { get; set; }
    public int BusinessId { get; set; }

    [Required]
    [Range(0, 6)]
    public int DayOfWeek { get; set; }

    [Required]
    public TimeSpan OpenTime { get; set; }

    [Required]
    public TimeSpan CloseTime { get; set; }

    public bool IsClosed { get; set; }
}

public class Review
{
    public int ReviewId { get; set; }
    public int BusinessId { get; set; }
    public int UserId { get; set; }

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation property
    public User? User { get; set; }
}

public class CreateBusinessRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public int CategoryId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Website { get; set; }

    [Required]
    public List<BusinessHourRequest> Hours { get; set; } = new();
}

public class BusinessHourRequest
{
    [Required]
    [Range(0, 6)]
    public int DayOfWeek { get; set; }

    [Required]
    public TimeSpan OpenTime { get; set; }

    [Required]
    public TimeSpan CloseTime { get; set; }

    public bool IsClosed { get; set; }
}

public class UpdateBusinessRequest : CreateBusinessRequest { }

public class BusinessImageRequest
{
    [Required]
    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    public bool IsMain { get; set; }
}

public class CreateReviewRequest
{
    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }
} 