using IA.Repository.Base;
using IA.Repository.Base.Dapper;
using Dapper;
using IA.Model;
using System.Threading;

namespace IA.Repository.Dapper
{
    public class RepositoryUser: RepositoryBase<int, User>, IRepositoryUser
    {
        public RepositoryUser(IConnectionFactory connectionFactory, ISessionScopeFactory sessionScopeFactory) : base(connectionFactory, sessionScopeFactory)
        {
        }

        public override User TryFind(int id)
        {
            ISessionScope sc = _sessionScopeFactory.Find(Thread.CurrentThread);
            string query = @"select u.* ,c.name as CityName from users as u
               left join cities AS c on c.id=u.city_id
where u.id = @id";
            if (sc != null)
            {
                using (DataAccessBase db = new DataAccessBase(sc.Connection))
                {
                    return db.DbConnection.QuerySingleOrDefault<User>(query,new { id });
                }
            }
            else
            {
                using (DataAccessBase db = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
                {
                    return db.DbConnection.QuerySingleOrDefault<User>(query, new { id });

                }
            }
        }

    }
}
