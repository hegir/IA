using IA.Repository.Base;
using IA.Model;
using IA.Repository.Base.Dapper;

namespace IA.Repository.Dapper
{
    public class RepositoryCanton : RepositoryBase<int, Canton>, IRepositoryCanton
    {
        private readonly ISessionScopeFactory _sessionScopeFactory;
        private readonly IConnectionFactory _connectionFactory;

        public RepositoryCanton(IConnectionFactory connectionFactory, ISessionScopeFactory sessionScopeFactory) : base(connectionFactory, sessionScopeFactory)
        {
            _sessionScopeFactory = sessionScopeFactory;
            _connectionFactory = connectionFactory;
        }
    }
}
