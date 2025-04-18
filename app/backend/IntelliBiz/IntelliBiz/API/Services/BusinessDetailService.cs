using System.Threading.Tasks;
using IntelliBiz.API.DTOs;
using IntelliBiz.API.Repositories;
using IntelliBiz.DTOs;

namespace IntelliBiz.API.Services
{
    public class BusinessDetailService : IBusinessDetailService
    {
        private readonly IBusinessRepository _businessRepository;
        private readonly IReviewRepository _reviewRepository;
        private readonly IServiceRepository _serviceRepository;

        public BusinessDetailService(
            IBusinessRepository businessRepository,
            IReviewRepository reviewRepository,
            IServiceRepository serviceRepository)
        {
            _businessRepository = businessRepository;
            _reviewRepository = reviewRepository;
            _serviceRepository = serviceRepository;
        }

        public async Task<BusinessDetailDto> GetBusinessDetailAsync(int businessId)
        {
            var business = await _businessRepository.GetByIdAsync(businessId);
            if (business == null)
            {
                return null;
            }

            var reviews = await _reviewRepository.GetByBusinessIdAsync(businessId);
            var services = await _serviceRepository.GetByBusinessIdAsync(businessId);

            return new BusinessDetailDto
            {
                Id = business.Id,
                Name = business.Name,
                Category = business.Category,
                Rating = business.Rating,
                ReviewCount = reviews.Count(),
                Description = business.Description,
                Address = business.Address,
                Phone = business.PhoneNumber,
                Email = business.Email,
                Website = business.Website,
                Founded = business.Founded,
                Owner = business.Owner,
                Employees = business.Employees,
                Services = services.Select(s => s.Name).ToList(),
                Hours = new BusinessHoursDto
                {
                    Monday = new DailyHoursDto { Open = business.Hours.Monday.Open, Close = business.Hours.Monday.Close },
                    Tuesday = new DailyHoursDto { Open = business.Hours.Tuesday.Open, Close = business.Hours.Tuesday.Close },
                    Wednesday = new DailyHoursDto { Open = business.Hours.Wednesday.Open, Close = business.Hours.Wednesday.Close },
                    Thursday = new DailyHoursDto { Open = business.Hours.Thursday.Open, Close = business.Hours.Thursday.Close },
                    Friday = new DailyHoursDto { Open = business.Hours.Friday.Open, Close = business.Hours.Friday.Close },
                    Saturday = new DailyHoursDto { Open = business.Hours.Saturday.Open, Close = business.Hours.Saturday.Close },
                    Sunday = new DailyHoursDto { Open = business.Hours.Sunday.Open, Close = business.Hours.Sunday.Close },
                }
,
                Images = business.Images,
                Verified = business.IsVerified,
                Licenses = business.Licenses,
                PaymentMethods = business.PaymentMethods,
                ServiceAreas = business.ServiceAreas
            };
        }
    }
}