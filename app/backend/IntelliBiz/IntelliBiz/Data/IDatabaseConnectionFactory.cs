using System.Data;

namespace IntelliBiz.Data
{
    public interface IDatabaseConnectionFactory
    {
        IDbConnection CreateConnection();
    }
}
