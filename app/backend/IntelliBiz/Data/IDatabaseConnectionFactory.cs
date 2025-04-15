using System.Data;

namespace IntelliBiz.API.Data
{
    public interface IDatabaseConnectionFactory
    {
        IDbConnection CreateConnection();
    }
}
