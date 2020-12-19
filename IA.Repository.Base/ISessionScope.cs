using System;

namespace IA.Repository.Base
{
    public interface ISessionScope : IDisposable
    {
        IDataAccess Connection { get; }
        void Rollback();
        void Commit();
    }
}