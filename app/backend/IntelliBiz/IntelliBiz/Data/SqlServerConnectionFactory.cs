using Microsoft.Data.SqlClient;
using System.Data;

namespace IntelliBiz.Data
{
    public class SqlServerConnectionFactory(string connectionString) : IDatabaseConnectionFactory
    {
        public IDbConnection CreateConnection()
        {
            return new SqlConnection(connectionString);
        }
    }
}
