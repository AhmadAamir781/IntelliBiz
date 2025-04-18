
using IntelliBiz.API.DTOs;
using IntelliBiz.API.Models;
using IntelliBiz.API.Repositories;
using IntelliBiz.DTOs;
using IntelliBiz.Models;

namespace IntelliBiz.API.Services
{
    public class BusinessAnalyticsService : IBusinessAnalyticsService
    {
        private readonly IBusinessRepository _businessRepository;
        private readonly IReviewRepository _reviewRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMessageRepository _messageRepository;

        public BusinessAnalyticsService(
            IBusinessRepository businessRepository,
            IReviewRepository reviewRepository,
            IAppointmentRepository appointmentRepository,
            IMessageRepository messageRepository)
        {
            _businessRepository = businessRepository;
            _reviewRepository = reviewRepository;
            _appointmentRepository = appointmentRepository;
            _messageRepository = messageRepository;
        }

        public async Task<BusinessAnalyticsDto> GetBusinessAnalyticsAsync(int businessId, string timeRange)
        {
            // Get date range based on timeRange parameter
            var (startDate, endDate) = GetDateRange(timeRange);

            // Fetch all relevant data
            var business = await _businessRepository.GetByIdAsync(businessId);
            var reviews = await _reviewRepository.GetByBusinessIdAsync(businessId);
            var appointments = await _appointmentRepository.GetByBusinessIdAsync(businessId);
            var messages = await _messageRepository.GetByBusinessIdAsync(businessId);

            // Filter data by date range
            reviews = reviews.Where(r => r.CreatedAt >= startDate && r.CreatedAt <= endDate).ToList();
            appointments = appointments.Where(a => a.CreatedAt >= startDate && a.CreatedAt <= endDate).ToList();
            messages = messages.Where(m => m.CreatedAt >= startDate && m.CreatedAt <= endDate).ToList();

            // Calculate metrics
            var overview = new OverviewData
            {
                ProfileViews = CalculateMetricData(business.ViewCount, GetPreviousPeriodCount(business.ViewCount, timeRange)),
                Appointments = CalculateMetricData(appointments.Count(), GetPreviousPeriodCount(appointments.Count(), timeRange)),
                Reviews = CalculateMetricData(reviews.Count(), GetPreviousPeriodCount(reviews.Count(), timeRange)),
                Messages = CalculateMetricData(messages.Count, GetPreviousPeriodCount(messages.Count, timeRange))
            };

            // Calculate top services
            var topServices = CalculateTopServices(appointments, timeRange);

            // Calculate demographics (mock data for now)
            var demographics = new DemographicsData
            {
                Age = new List<AgeGroup>
                {
                    new AgeGroup { Group = "18-24", Percentage = 10 },
                    new AgeGroup { Group = "25-34", Percentage = 35 },
                    new AgeGroup { Group = "35-44", Percentage = 25 },
                    new AgeGroup { Group = "45-54", Percentage = 15 },
                    new AgeGroup { Group = "55-64", Percentage = 10 },
                    new AgeGroup { Group = "65+", Percentage = 5 }
                },
                Gender = new List<GenderGroup>
                {
                    new GenderGroup { Group = "Male", Percentage = 55 },
                    new GenderGroup { Group = "Female", Percentage = 45 }
                },
                Location = new List<LocationGroup>
                {
                    new LocationGroup { Area = "Manhattan", Percentage = 40 },
                    new LocationGroup { Area = "Brooklyn", Percentage = 25 },
                    new LocationGroup { Area = "Queens", Percentage = 20 },
                    new LocationGroup { Area = "Bronx", Percentage = 10 },
                    new LocationGroup { Area = "Staten Island", Percentage = 5 }
                }
            };

            // Calculate sources (mock data for now)
            var sources = new List<SourceData>
            {
                new SourceData { Source = "Search", Percentage = 45 },
                new SourceData { Source = "Direct", Percentage = 20 },
                new SourceData { Source = "Referral", Percentage = 15 },
                new SourceData { Source = "Social Media", Percentage = 12 },
                new SourceData { Source = "Email", Percentage = 8 }
            };

            return new BusinessAnalyticsDto
            {
                Overview = overview,
                TopServices = topServices,
                Demographics = demographics,
                Sources = sources
            };
        }

        private (DateTime startDate, DateTime endDate) GetDateRange(string timeRange)
        {
            var endDate = DateTime.UtcNow;
            var startDate = timeRange switch
            {
                "7days" => endDate.AddDays(-7),
                "30days" => endDate.AddDays(-30),
                "90days" => endDate.AddDays(-90),
                "year" => endDate.AddYears(-1),
                _ => endDate.AddDays(-30) // Default to 30 days
            };
            return (startDate, endDate);
        }

        private MetricData CalculateMetricData(int currentCount, int previousCount)
        {
            var change = previousCount == 0 ? 100 : ((currentCount - previousCount) * 100) / previousCount;
            return new MetricData
            {
                Total = currentCount,
                Change = Math.Abs(change),
                Positive = change >= 0
            };
        }

        private int GetPreviousPeriodCount(int currentCount, string timeRange)
        {
            // This is a simplified version. In a real implementation, you would fetch the actual count from the previous period
            return (int)(currentCount * 0.8); // Assume 20% less than current period
        }

        private List<TopServiceDto> CalculateTopServices(IEnumerable<Appointment> appointments, string timeRange)
        {
            // Group appointments by service and calculate metrics
            var serviceMetrics = appointments
                .GroupBy(a => a.ServiceName)
                .Select(g => new TopServiceDto
                {
                    Name = g.Key,
                    Views = g.Count() * 10, // Mock view count
                    Bookings = g.Count(),
                    Revenue = $"${g.Count() * 100}", // Mock revenue
                    Growth = 10, // Mock growth
                    Positive = true
                })
                .OrderByDescending(s => s.Bookings)
                .Take(5)
                .ToList();

            return serviceMetrics;
        }
    }
} 