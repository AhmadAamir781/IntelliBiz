using Npgsql;
using System.Data;

namespace IntelliBiz.API.Data
{
    public class PostgreSqlConnectionFactory : IDatabaseConnectionFactory
    {
        private readonly string _connectionString;

        public PostgreSqlConnectionFactory(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IDbConnection CreateConnection()
        {
            return new NpgsqlConnection(_connectionString);
        }
    }
}
