using IA.Repository.Base;
using IA.Repository.Base.Dapper;
using Dapper;
using IA.Model;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Threading;

namespace IA.Repository.Dapper
{
    public class RepositoryRefreshToken: RepositoryBase<string,RefreshToken>,IRepositoryRefreshToken
    {
        public RepositoryRefreshToken(IConnectionFactory connectionFactory,ISessionScopeFactory sessionScopeFactory): base(connectionFactory, sessionScopeFactory)
        {

        }

        public void DeleteAll(int userId)
        {
            ISessionScope sessionScope = _sessionScopeFactory.Find(Thread.CurrentThread);
            string query = @"DELETE  from refresh_tokens where user_id=@userId";

            if(sessionScope != null)
            {
                using (DataAccessBase dataAccess = new DataAccessBase(sessionScope.Connection))
                {
                    dataAccess.DbConnection.Execute(query, new { userId });
                }
            }
            else
            {
                using (DataAccessBase dataAccess = new DataAccessBase(sessionScope.Connection))
                {
                    dataAccess.DbConnection.Execute(query, new { userId });
                }
            }
        }
    }
}
