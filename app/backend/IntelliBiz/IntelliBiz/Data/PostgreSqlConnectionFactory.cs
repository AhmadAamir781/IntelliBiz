using Npgsql;
using System.Data;

namespace IntelliBiz.Data
{
    public class PostgreSqlConnectionFactory(string connectionString) : IDatabaseConnectionFactory
    {
        public IDbConnection CreateConnection()
        {
            return new NpgsqlConnection(connectionString);
        }
    }
}
