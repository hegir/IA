using IA.Repository.Base;
using IA.Repository.Base.Dapper;
using Dapper;
using IA.Model;
using System.Collections.Generic;
using System.Threading;

namespace IA.Repository.Dapper
{
    public class RepositoryPermission : RepositoryBase<string, Permission>, IRepositoryPermission
    {

        public RepositoryPermission(IConnectionFactory connectionFactory, ISessionScopeFactory sessionScopeFactory) : base(connectionFactory, sessionScopeFactory)
        {  }

        public IEnumerable<Permission> Find(List<string> ids)
        {
            ISessionScope sc = _sessionScopeFactory.Find(Thread.CurrentThread);
            if(sc != null)
            {
                using (DataAccessBase db = new DataAccessBase(sc.Connection))
                {
                    return db.DbConnection.Query<Permission>("select *  from permissions where id=any(@ids)", new { ids });
                }
            }
            else
            {
                using (DataAccessBase db = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
                {
                    return db.DbConnection.Query<Permission>("select * from permissions where id=any(@ids)", new { ids });
                }
            }
        }
    }
}
