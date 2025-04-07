using Microsoft.Data.SqlClient;
using Npgsql;
using System.Data;

namespace IntelliBiz.Database
{
    public class DapperContext
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly bool _usePostgres;

        public DapperContext(IConfiguration configuration)
        {
            _configuration = configuration;
            _usePostgres = _configuration.GetValue<bool>("UsePostgres");
            _connectionString = _configuration.GetConnectionString(_usePostgres ? "PostgreSQLConnection" : "SqlServerConnection")
                ?? throw new InvalidOperationException("Connection string not found.");
        }

        public IDbConnection CreateConnection()
        {
            return _usePostgres
                ? new NpgsqlConnection(_connectionString) as IDbConnection
                : new SqlConnection(_connectionString) as IDbConnection;
        }
    }
}