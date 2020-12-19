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
    public class RepositoryCity : RepositoryBase<int, City>, IRepositoryCity
    {
        private readonly ISessionScopeFactory _sessionScopeFactory;
        private readonly IConnectionFactory _connectionFactory;

        public RepositoryCity(IConnectionFactory connectionFactory, ISessionScopeFactory sessionScopeFactory) : base(connectionFactory, sessionScopeFactory)
        {
            _sessionScopeFactory = sessionScopeFactory;
            _connectionFactory = connectionFactory;
        }

        public int CountAll(string searchCityName, string searchPostCode, string searchMunicipalityCode, int? searchCanton)
        {
            string query = $@"SELECT  COUNT(DISTINCT(c.*))
                                FROM cities as c
JOIN cantons as cc ON c.canton_id=cc.id
WHERE 
(CASE WHEN @searchCanton IS NOT NULL THEN c.canton_id=@searchCanton ELSE TRUE END) AND
(CASE WHEN @searchPostCode IS NOT NULL THEN c.post_code ilike '%{searchPostCode}%' ELSE TRUE END) AND
(CASE WHEN @searchMunicipalityCode IS NOT NULL THEN c.municipality_code ilike '%{searchMunicipalityCode}%' ELSE TRUE END) AND
(CASE WHEN @searchCityName IS NOT NULL THEN c.name ilike '%{searchCityName}%' ELSE TRUE END)";

            ISessionScope sc = _sessionScopeFactory.Find(Thread.CurrentThread);
            if (sc != null)
            {
                using (DataAccessBase db = new DataAccessBase(sc.Connection))
                {
                    return db.DbConnection.QuerySingleOrDefault<int>(query, new { searchCityName,searchPostCode,searchMunicipalityCode,searchCanton });
                }
            }
            else
            {
                using (DataAccessBase db = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
                {
                    return db.DbConnection.QuerySingleOrDefault<int>(query, new { searchCityName, searchPostCode, searchMunicipalityCode, searchCanton });
                }
            }
        }

        public override IEnumerable<City> FindAll()
        {
            ISessionScope sc = _sessionScopeFactory.Find(Thread.CurrentThread);

            string query = @"select c.* ,ca.name as cantonname,CONCAT(c.name,' (',c.municipality_code , ')') as city_name_municipality_code from cities as c 
        left join cantons AS ca on ca.id = c.canton_id";


            if (sc != null)
            {
                using (DataAccessBase db = new DataAccessBase(sc.Connection))
                {
                    return db.DbConnection.Query<City>(query);
                }
            }
            else
            {
                using (DataAccessBase db = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
                {
                    return db.DbConnection.Query<City>(query);
                }
            }
        }

        public IEnumerable<City> FindAllCities(int limit, int offset, string sortingColumn, int order, string searchCityName, string searchPostCode, string searchMunicipalityCode, int? searchCanton)
        {
            if (searchCityName == null)
                searchCityName = "";
            if (searchPostCode == null)
                searchPostCode = "";
            if (searchMunicipalityCode == null)
                searchMunicipalityCode = "";
            MemberInfo info = typeof(City).GetMember(sortingColumn)[0];
            ColumnAttribute columnAttribute = (ColumnAttribute)info.GetCustomAttribute(typeof(ColumnAttribute));

            string orderBy = "";
            if (columnAttribute != null)
                orderBy = columnAttribute.Name;
            else if (sortingColumn == "PostCode")
                orderBy = "post_code";
            else if (sortingColumn == "CantonName")
                orderBy = "canton_name";
            else if (sortingColumn == "MunicipalityCode")
                orderBy = "municipality_code";
            else if (sortingColumn == "Name")
                orderBy = "name";
            OrderType orderType = (OrderType)order;
            orderBy = orderBy + " " + (order == 0 ? OrderType.ASC.ToString() : OrderType.DESC.ToString());

            string query = $@"SELECT c.id as id, c.name as name,c.municipality_code as municipality_code, cc.name as canton_name,c.post_code as post_code
FROM cities as c
JOIN cantons as cc ON c.canton_id=cc.id
WHERE 
(CASE WHEN @searchCanton IS NOT NULL THEN c.canton_id=@searchCanton ELSE TRUE END) AND
(CASE WHEN @searchPostCode IS NOT NULL THEN c.post_code ilike '%{searchPostCode}%' ELSE TRUE END) AND
(CASE WHEN @searchMunicipalityCode IS NOT NULL THEN c.municipality_code ilike '%{searchMunicipalityCode}%' ELSE TRUE END) AND
(CASE WHEN @searchCityName IS NOT NULL THEN c.name ilike '%{searchCityName}%' ELSE TRUE END)
ORDER BY {orderBy}
LIMIT @limit
OFFSET @offset";



            ISessionScope sc = _sessionScopeFactory.Find(Thread.CurrentThread);
            if (sc != null)
            {
                using (DataAccessBase db = new DataAccessBase(sc.Connection))
                {
                    return db.DbConnection.Query<City>(query, new { limit, offset, orderBy, searchCityName,searchPostCode,searchMunicipalityCode,searchCanton });
                }
            }
            else
            {
                using (DataAccessBase db = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
                {
                    return db.DbConnection.Query<City>(query, new { limit, offset, orderBy, searchCityName, searchPostCode, searchMunicipalityCode, searchCanton });
                }
            }
        }
    }
}
