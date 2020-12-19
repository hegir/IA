using IA.Repository.Base.Dapper.Helpers;
using Dapper;
using Dapper.FastCrud;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using IA.Model.Base;

namespace IA.Repository.Base.Dapper
{
    public class RepositoryBase<TK, TEntity> : IRepositoryBase<TK, TEntity> where TEntity : IEntity<TK>, new()
    {
        protected readonly IConnectionFactory _connectionFactory;
        protected readonly ISessionScopeFactory _sessionScopeFactory;

        public RepositoryBase(IConnectionFactory connectionFactory, ISessionScopeFactory sessionScopeFactory)
        {
            _connectionFactory = connectionFactory;
            _sessionScopeFactory = sessionScopeFactory;
        }

        public virtual IEnumerable<TEntity> FindAll()
        {
            CommandDefinition result = QueryFactory.GetQuery<TEntity, TEntity>();

            ISessionScope sessionScope = _sessionScopeFactory.Find(Thread.CurrentThread);
            if (sessionScope != null)
            {
                using (DataAccessBase cn = new DataAccessBase(sessionScope.Connection))
                {
                    return cn.DbConnection.Query<TEntity>(result);
                }
            }
            using (DataAccessBase cn = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
            {
                return cn.DbConnection.Query<TEntity>(result);
            }
        }

        public virtual TEntity TryFind(TK id)
        {
            ISessionScope sessionScope = _sessionScopeFactory.Find(Thread.CurrentThread);
            if (sessionScope != null)
            {
                using (DataAccessBase cn = new DataAccessBase(sessionScope.Connection))
                {
                    return cn.DbConnection.Get(new TEntity { Id = id }, builder => builder.AttachToTransaction(cn.DbTransaction));
                }
            }
            using (DataAccessBase cn = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
            {
                return cn.DbConnection.Get(new TEntity { Id = id }, builder => builder.AttachToTransaction(cn.DbTransaction));
            }
        }

        public virtual void Insert(TEntity item)
        {
            ISessionScope sessionScope = _sessionScopeFactory.Find(Thread.CurrentThread);
            if (sessionScope != null)
            {
                using (DataAccessBase cn = new DataAccessBase(sessionScope.Connection))
                {
                    cn.DbConnection.Insert(item, builder => builder.AttachToTransaction(cn.DbTransaction));
                }
                return;
            }
            using (DataAccessBase cn = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
            {
                cn.DbConnection.Insert(item, builder => builder.AttachToTransaction(cn.DbTransaction));
            }
        }

        public virtual bool Update(TEntity item)
        {
            ISessionScope sessionScope = _sessionScopeFactory.Find(Thread.CurrentThread);
            if (sessionScope != null)
            {
                using (DataAccessBase cn = new DataAccessBase(sessionScope.Connection))
                {
                    return cn.DbConnection.Update(item, builder => builder.AttachToTransaction(cn.DbTransaction));
                }
            }
            using (DataAccessBase cn = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
            {
                return cn.DbConnection.Update(item, builder => builder.AttachToTransaction(cn.DbTransaction));
            }
        }

        public virtual bool Delete(TK id)
        {
            ISessionScope sessionScope = _sessionScopeFactory.Find(Thread.CurrentThread);
            if (sessionScope != null)
            {
                using (DataAccessBase cn = new DataAccessBase(sessionScope.Connection))
                {
                    return cn.DbConnection.Delete(new TEntity { Id = id }, builder => builder.AttachToTransaction(cn.DbTransaction));
                }
            }
            using (DataAccessBase cn = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
            {
                return cn.DbConnection.Delete(new TEntity { Id = id }, builder => builder.AttachToTransaction(cn.DbTransaction));
            }
        }

        public virtual int Count()
        {
            ISessionScope sessionScope = _sessionScopeFactory.Find(Thread.CurrentThread);
            if (sessionScope != null)
            {
                using (DataAccessBase cn = new DataAccessBase(sessionScope.Connection))
                {
                    return cn.DbConnection.Count<TEntity>(builder => builder.AttachToTransaction(cn.DbTransaction));
                }
            }
            using (DataAccessBase cn = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
            {
                return cn.DbConnection.Count<TEntity>(builder => builder.AttachToTransaction(cn.DbTransaction));
            }
        }

        public virtual IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate, bool descending = false, params Expression<Func<TEntity, object>>[] orderBys)
        {
            CommandDefinition result = QueryFactory.GetQuery(predicate, null, null, descending, orderBys);

            ISessionScope sessionScope = _sessionScopeFactory.Find(Thread.CurrentThread);
            if (sessionScope != null)
            {
                using (DataAccessBase cn = new DataAccessBase(sessionScope.Connection))
                {
                    return cn.DbConnection.Query<TEntity>(result);
                }
            }
            using (DataAccessBase cn = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
            {
                return cn.DbConnection.Query<TEntity>(result);
            }
        }

        public TEntity FindOne(Expression<Func<TEntity, bool>> predicate, bool descending = false, params Expression<Func<TEntity, object>>[] orderBys)
        {
            return Find(predicate, descending, orderBys).FirstOrDefault();
        }

    }
}