using System.Threading;

namespace IA.Repository.Base
{
    public interface ISessionScopeFactory
    {
        void Add(Thread thread, ISessionScope session);
        void Remove(Thread thread);
        ISessionScope Find(Thread thread);
    }
}