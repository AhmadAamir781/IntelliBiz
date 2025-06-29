namespace IntelliBiz.DTOs
{
    public class BusinessDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public double Rating { get; set; }
        public int ReviewCount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string Founded { get; set; } = string.Empty;
        public string Owner { get; set; } = string.Empty;
        public string Employees { get; set; } = string.Empty;
        public List<string> Services { get; set; } = new();
        public BusinessHoursDto Hours { get; set; } = new();
        public List<string> Images { get; set; } = new();
        public bool Verified { get; set; }
        public string Licenses { get; set; } = string.Empty;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<string> PaymentMethods { get; set; } = new();
        public List<string> ServiceAreas { get; set; } = new();
    }

}
