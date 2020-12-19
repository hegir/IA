using IA.Repository.Base;
using Autofac;

namespace IA.Repository.Autofac
{
    public class SessionManager : ISessionManager
    {
        private readonly IContainer _container;

        public SessionManager(IContainer container)
        {
            _container = container;
        }

        public ISessionScope Create()
        {
            return _container.Resolve<ISessionScope>();
        }

        public ISessionScope Create(string name)
        {
            return _container.ResolveNamed<ISessionScope>(name);
        }
    }
}