using System;
using System.Threading;

namespace IA.Repository.Base.Dapper
{
    public class SessionScope : ISessionScope
    {
        private readonly ISessionScopeFactory _sessionScopeFactory;
        public IDataAccess Connection { get; private set; }
        private bool _commited;
        private bool _rollback;

        public SessionScope(IConnectionFactory connectionFactory, ISessionScopeFactory sessionScopeFactory)
        {
            _sessionScopeFactory = sessionScopeFactory;

            if (Connection == null)
            {
                Connection = new DataAccessBase(connectionFactory.GetConnection, connectionFactory.Transaction);
            }

            _sessionScopeFactory.Add(Thread.CurrentThread, this);
        }

        public void Dispose()
        {
            try
            {
                if (!_commited)
                {
                    if (!_rollback)
                    {
                        Rollback();
                        _sessionScopeFactory.Remove(Thread.CurrentThread);
                    }
                    else
                    {
                        _sessionScopeFactory.Remove(Thread.CurrentThread);
                    }
                }
                else
                {
                    _sessionScopeFactory.Remove(Thread.CurrentThread);
                }
            }
            catch (Exception)
            {
                //Dispose methods should not throw exceptions
            }
            finally
            {
                Connection.Dispose();
            }
        }

        public void Rollback()
        {
            _rollback = true;
            Connection.Rollback();
        }

        public void Commit()
        {
            _commited = true;
        }
    }
}