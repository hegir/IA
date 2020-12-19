using IA.Repository.Base;
using IA.Repository.Base.Dapper;
using IA.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace IA.Repository.Dapper
{
    public class RepositoryRole : RepositoryBase<string, Role>, IRepositoryRole
    {
        private readonly ISessionScopeFactory _sessionScopeFactory;
        private readonly IConnectionFactory _connectionFactory;

        public RepositoryRole(IConnectionFactory connectionFactory, ISessionScopeFactory sessionScopeFactory) : base(connectionFactory, sessionScopeFactory)
        {
            _sessionScopeFactory = sessionScopeFactory;
            _connectionFactory = connectionFactory;
        }


    }
}
