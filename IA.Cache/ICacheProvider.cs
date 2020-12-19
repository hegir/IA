using System.Collections.Generic;

namespace IA.Cache
{
    public interface ICacheProvider
    {
        void Start();
        void Stop();
        bool CheckPermission(string role, string permission);
        List<string> GetPermissions(string role);
    }
}
