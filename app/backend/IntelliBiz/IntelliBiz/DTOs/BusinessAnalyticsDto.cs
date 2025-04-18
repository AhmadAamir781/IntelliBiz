using IntelliBiz.Models;

namespace IntelliBiz.DTOs
{
    public class BusinessAnalyticsDto
    {
        public OverviewData Overview {get; set;}
        public List<TopServiceDto> TopServices {get; set;}
        public DemographicsData Demographics {get; set;}
        public List<SourceData> Sources {get; set;}
    }
}
