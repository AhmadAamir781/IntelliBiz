using Microsoft.Data.SqlClient;
using System.Data;

namespace IntelliBiz.API.Data
{
    public class SqlServerConnectionFactory : IDatabaseConnectionFactory
    {
        private readonly string _connectionString;

        public SqlServerConnectionFactory(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IDbConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}
