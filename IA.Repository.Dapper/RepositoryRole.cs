using IA.Repository.Base;
using IA.Repository.Base.Dapper;
using IA.Model;

namespace IA.Repository.Dapper
{
    public class RepositoryRole : RepositoryBase<string, Role>, IRepositoryRole
    {

        public RepositoryRole(IConnectionFactory connectionFactory, ISessionScopeFactory sessionScopeFactory) : base(connectionFactory, sessionScopeFactory)
        { }


    }
}
