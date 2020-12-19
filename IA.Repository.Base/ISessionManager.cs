using System;
using System.Collections.Generic;
using System.Text;

namespace IA.Repository.Base
{
    public interface ISessionManager
    {
        ISessionScope Create();
        ISessionScope Create(string name);
    }
}