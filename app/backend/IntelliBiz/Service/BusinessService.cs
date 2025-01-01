using IntelliBiz.Interfaces;
using IntelliBiz.Models;

namespace IntelliBiz.Service
{
    public class BusinessService
    {
        private readonly IRepository<Business> _repository;

        public BusinessService(IRepository<Business> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Business>> GetAllBusinessesAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task AddBusinessAsync(Business business)
        {
            await _repository.AddAsync(business);
        }
    }
}
