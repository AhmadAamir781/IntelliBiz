namespace IntelliBiz.API.Models
{
    public class AdminStatistics
    {
        public int TotalUsers { get; set; }
        public int TotalBusinesses { get; set; }
        public int TotalAppointments { get; set; }
        public int NewUsersToday { get; set; }
        public int NewBusinessesToday { get; set; }
        public int NewAppointmentsToday { get; set; }
        public List<KeyValuePair<string, int>> BusinessesByCategory { get; set; } = new List<KeyValuePair<string, int>>();
        public List<KeyValuePair<string, int>> BusinessesByCity { get; set; } = new List<KeyValuePair<string, int>>();
        public List<KeyValuePair<DateTime, int>> UserRegistrationTrend { get; set; } = new List<KeyValuePair<DateTime, int>>();
        public List<KeyValuePair<DateTime, int>> BusinessRegistrationTrend { get; set; } = new List<KeyValuePair<DateTime, int>>();
    }

    public class OwnerStatistics
    {
        public int TotalAppointments { get; set; }
        public int PendingAppointments { get; set; }
        public int TotalServices { get; set; }
        public int TotalMessages { get; set; }
        public int UnreadMessages { get; set; }
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }
        public int ViewsThisMonth { get; set; }
        public List<KeyValuePair<DateTime, int>> AppointmentTrend { get; set; } = new List<KeyValuePair<DateTime, int>>();
        public List<KeyValuePair<string, int>> AppointmentsByService { get; set; } = new List<KeyValuePair<string, int>>();
    }
}