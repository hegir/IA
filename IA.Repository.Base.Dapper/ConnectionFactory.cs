using IA.Repository.Base.Dapper.Helpers;
using Dapper;
using Dapper.FastCrud;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace IA.Repository.Base.Dapper
{
    public class ConnectionFactory : IConnectionFactory
    {
        private readonly IConfiguration _configuration;
        private readonly string _connection;

        public IDbConnection GetConnection
        {
            get
            {
                OrmConfiguration.DefaultDialect = SqlDialect.PostgreSql;
                DefaultTypeMap.MatchNamesWithUnderscores = true;
                return new NpgsqlConnection(_configuration.GetConnectionString(_connection));
            }
        }
        public bool Transaction { get; set; }

        public ConnectionFactory(IConfiguration configuration, string connection, bool transaction = false)
        {
            _configuration = configuration;
            _connection = connection;
            Transaction = transaction;

            SqlMapper.AddTypeHandler(new DateTimeHelper());
        }
    }
}