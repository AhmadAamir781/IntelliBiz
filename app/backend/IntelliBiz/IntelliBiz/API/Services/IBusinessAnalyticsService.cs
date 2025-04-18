using System.Threading.Tasks;
using IntelliBiz.API.DTOs;
using IntelliBiz.DTOs;

namespace IntelliBiz.API.Services
{
    public interface IBusinessAnalyticsService
    {
        Task<BusinessAnalyticsDto> GetBusinessAnalyticsAsync(int businessId, string timeRange);
    }
} 