using IA.Repository.Base;
using IA.Repository.Base.Dapper;
using Dapper;
using IA.Enums;
using IA.Model;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection;
using System.Threading;

namespace IA.Repository.Dapper
{
    public class RepositoryUser: RepositoryBase<int, User>, IRepositoryUser
    {
        private readonly ISessionScopeFactory _sessionScopeFactory;
        private readonly IConnectionFactory _connectionFactory;

        public RepositoryUser(IConnectionFactory connectionFactory, ISessionScopeFactory sessionScopeFactory) : base(connectionFactory, sessionScopeFactory)
        {
            _sessionScopeFactory = sessionScopeFactory;
            _connectionFactory = connectionFactory;
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

        public IEnumerable<User> FindAll(int limit, int offset, string sortingColumn, int order, string searchText, int? cityId)
        {
            if (searchText == null)
                searchText = "";
            string orderBy = "";
            MemberInfo info = typeof(User).GetMember(sortingColumn)[0];
            ColumnAttribute columnAttribute = (ColumnAttribute)info.GetCustomAttribute(typeof(ColumnAttribute));
            ISessionScope sc = _sessionScopeFactory.Find(Thread.CurrentThread);

            if (columnAttribute != null)
                orderBy = columnAttribute.Name;
            else if (sortingColumn == "CityName")
                orderBy = "city_name";

            string query;
            OrderType orderType = (OrderType)order;

            orderBy = orderBy + " " + (order == 0 ? OrderType.ASC.ToString() : OrderType.DESC.ToString());


             query = $@"SELECT * FROM users_find(@limit,@offset,@orderBy,@searchText,@cityId)"; 

            if(sc != null)
            {
                using (DataAccessBase db = new DataAccessBase(sc.Connection))
                {
                    return db.DbConnection.Query<User>(query, new { limit,offset, orderBy, searchText,cityId});
                }
            }
            else
            {
                using (DataAccessBase db = new DataAccessBase(_connectionFactory.GetConnection,_connectionFactory.Transaction))
                {
                    return db.DbConnection.Query<User>(query, new { limit, offset, orderBy, searchText, cityId });
                }
            }
        }

        public int CountAll(string searchText, int? cityId)
        {
            string query = $@"SELECT  COUNT(DISTINCT(U.*))
FROM users AS U 
JOIN cities AS C ON U.city_id = C.id AND
((CASE WHEN @searchText IS NOT NULL THEN U.first_name || ' ' || U.last_name ilike '%{searchText}%' ELSE TRUE END) OR
(CASE WHEN @searchText IS NOT NULL THEN U.username ilike '%{searchText}%' ELSE TRUE END)) AND
(CASE WHEN @cityId IS NOT NULL THEN C.id = @cityId ELSE TRUE END)";

            ISessionScope sc = _sessionScopeFactory.Find(Thread.CurrentThread);
            if (sc != null)
            {
                using (DataAccessBase db = new DataAccessBase(sc.Connection))
                {
                    return db.DbConnection.QuerySingleOrDefault<int>(query, new { searchText, cityId });
                }
            }
            else
            {
                using (DataAccessBase db = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
                {
                    return db.DbConnection.QuerySingleOrDefault<int>(query, new { searchText, cityId });
                }
            }
        }

    }
}
