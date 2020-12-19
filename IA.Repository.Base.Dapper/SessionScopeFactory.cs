using System.Collections.Generic;
using System.Threading;

namespace IA.Repository.Base.Dapper
{
    public class SessionScopeFactory : ISessionScopeFactory
    {
        private Dictionary<Thread, Stack<ISessionScope>> _sessionScopes;
        public SessionScopeFactory()
        {
            _sessionScopes = new Dictionary<Thread, Stack<ISessionScope>>();
        }

        public void Add(Thread thread, ISessionScope session)
        {
            lock (_sessionScopes)
            {
                if (!_sessionScopes.ContainsKey(thread))
                    _sessionScopes.Add(thread, new Stack<ISessionScope>());
                _sessionScopes[thread].Push(session);
            }
        }

        public ISessionScope Find(Thread thread)
        {
            lock (_sessionScopes)
            {
                if (_sessionScopes.ContainsKey(thread))
                    return _sessionScopes[thread].Peek();
            }
            return null;
        }

        public void Remove(Thread thread)
        {
            lock (_sessionScopes)
            {
                if (_sessionScopes.ContainsKey(thread))
                {
                    if (_sessionScopes[thread].Count > 0)
                        _sessionScopes[thread].Pop();
                    if (_sessionScopes[thread].Count == 0)
                        _sessionScopes.Remove(thread);
                }
            }
        }
    }
}