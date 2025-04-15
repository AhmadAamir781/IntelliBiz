namespace IntelliBiz.API.Models
{
    public class Business
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string LogoUrl { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
        public bool IsVerified { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public double AverageRating { get; set; } = 0;
        public int ReviewCount { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties (not stored in DB)
        public List<BusinessHour> BusinessHours { get; set; } = new List<BusinessHour>();
        public List<BusinessService> Services { get; set; } = new List<BusinessService>();
        public List<string> Images { get; set; } = new List<string>();
    }

    public class BusinessQueryParameters
    {
        public string? Search { get; set; }
        public string? Category { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public bool? IsVerified { get; set; }
        public bool? IsActive { get; set; }
        public string? SortBy { get; set; }
        public string? Order { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class BusinessHour
    {
        public int Id { get; set; }
        public int BusinessId { get; set; }
        public int DayOfWeek { get; set; } // 0 = Sunday, 1 = Monday, etc.
        public string OpenTime { get; set; } = "09:00";
        public string CloseTime { get; set; } = "17:00";
        public bool IsClosed { get; set; } = false;
    }

    public class BusinessService
    {
        public int Id { get; set; }
        public int BusinessId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DurationMinutes { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class PagedResult<T>
    {
        public IEnumerable<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int PageCount { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
    }
}