using IA.Model.Base;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace IA.Repository.Base
{
    public interface IRepositoryBase<in TK, TEntity> where TEntity : IEntity<TK>
    {
        IEnumerable<TEntity> FindAll();
        TEntity TryFind(TK id);
        void Insert(TEntity item);
        bool Update(TEntity item);
        bool Delete(TK id);
        int Count();
        IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate, bool descending = false, params Expression<Func<TEntity, object>>[] orderBys);
        TEntity FindOne(Expression<Func<TEntity, bool>> predicate, bool descending = false, params Expression<Func<TEntity, object>>[] orderBys);
    }
}