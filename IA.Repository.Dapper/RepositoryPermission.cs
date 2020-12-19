using IA.Repository.Base;
using IA.Repository.Base.Dapper;
using Dapper;
using IA.Model;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace IA.Repository.Dapper
{
    public class RepositoryPermission : RepositoryBase<string, Permission>, IRepositoryPermission
    {
        private readonly ISessionScopeFactory _sessionScopeFactory;
        private readonly IConnectionFactory _connectionFactory;

        public RepositoryPermission(IConnectionFactory connectionFactory, ISessionScopeFactory sessionScopeFactory) : base(connectionFactory, sessionScopeFactory)
        {
            _sessionScopeFactory = sessionScopeFactory;
            _connectionFactory = connectionFactory;
        }

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
