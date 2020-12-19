using IA.Repository.Base;
using IA.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace IA.Repository
{
    public interface IRepositoryPermission : IRepositoryBase<string, Permission>
    {
        IEnumerable<Permission> Find(List<string> ids);
    }
}
