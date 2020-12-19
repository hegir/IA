using IA.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace IA.Repository
{
    public interface IRepositoryRolePermission
    {
        IEnumerable<RolePermission> Find(string roleId);
        RolePermission TryFind(string roleId, string permissionId);
        void Insert(RolePermission rolePermission);
        void Delete(RolePermission rolePermission);
    }
}
