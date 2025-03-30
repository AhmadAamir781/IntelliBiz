using IntelliBiz.Models;

namespace IntelliBiz.Security
{
    namespace IntelliBiz.Services.Interfaces
    {
        public interface IJwtTokenService
        {
            string GenerateToken(User user);
        }
    }

}
