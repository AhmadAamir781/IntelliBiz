namespace IntelliBiz.DTOs
{
    public class DailyHoursDto
    {
        public string Open { get; set; } = string.Empty;
        public string Close { get; set; } = string.Empty;
    }

    public class BusinessHoursDto
    {
        public DailyHoursDto Monday { get; set; } = new();
        public DailyHoursDto Tuesday { get; set; } = new();
        public DailyHoursDto Wednesday { get; set; } = new();
        public DailyHoursDto Thursday { get; set; } = new();
        public DailyHoursDto Friday { get; set; } = new();
        public DailyHoursDto Saturday { get; set; } = new();
        public DailyHoursDto Sunday { get; set; } = new();
    }
}
