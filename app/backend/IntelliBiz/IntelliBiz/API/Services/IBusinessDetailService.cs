using IntelliBiz.DTOs;

namespace IntelliBiz.API.Services
{
    public interface IBusinessDetailService
    {
        Task<BusinessDetailDto?> GetBusinessDetailAsync(int businessId);
    }
} 