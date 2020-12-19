using System;
using System.Data;

namespace IA.Repository.Base
{
    public interface IDataAccess : IDisposable
    {
        IDbConnection DbConnection { get; }
        IDbTransaction DbTransaction { get; }
        bool UseTransaction { get; }
        bool ExternalConnection { get; }
        void Rollback();
    }
}