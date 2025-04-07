using IntelliBiz.API.Models;

namespace IntelliBiz.Services
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}