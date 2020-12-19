using IA.Repository.Base;
using IA.Repository.Base.Dapper;
using Dapper;
using IA.Model;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace IA.Repository.Dapper
{
    public class RepositoryRolePermission:IRepositoryRolePermission
    {
        private readonly ISessionScopeFactory _sessionScopeFactory;
        private readonly IConnectionFactory _connectionFactory;

        public RepositoryRolePermission(ISessionScopeFactory sessionScopeFactory,IConnectionFactory connectionFactory)
        {
            _sessionScopeFactory = sessionScopeFactory;
            _connectionFactory = connectionFactory;
        }

        public void Delete(RolePermission rolePermission)
        {
            ISessionScope sc = _sessionScopeFactory.Find(Thread.CurrentThread);
            if(sc != null)
            {
                using(DataAccessBase db =new DataAccessBase(sc.Connection))
                {
                    db.DbConnection.Execute("delete from roles_permissions where role_id=@RoleId and permission_id=@PermissionId", rolePermission);
                }
            }
            else
            {
                using(DataAccessBase db=new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
                {
                    db.DbConnection.Execute("delete from roles_permissions where role_id=@RoleId and permission_id=@PermissionId", rolePermission);
                }
            }
        }

        public IEnumerable<RolePermission> Find(string roleId)
        {
            ISessionScope sc = _sessionScopeFactory.Find(Thread.CurrentThread);
            if(sc != null)
            {
                using(DataAccessBase db=new DataAccessBase(sc.Connection))
                {
                    return db.DbConnection.Query<RolePermission>("select * from roles_permissions where role_id=@roleId", new { roleId });
                }
            }
            else
            {
                using(DataAccessBase db=new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
                {
                    return db.DbConnection.Query<RolePermission>("select * from roles_permissions where role_id=@roleid", new { roleId });
                }
            }
        }

        public void Insert(RolePermission rolePermission)
        {
            ISessionScope sc = _sessionScopeFactory.Find(Thread.CurrentThread);
            if(sc != null)
            {
                using (DataAccessBase db=new DataAccessBase(sc.Connection))
                {
                    db.DbConnection.Execute("insert into roles_permissions (role_id,permission_id) values (@RoleId,@PermissionId)", rolePermission);
                }
            }
            else
            {
                using (DataAccessBase db = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
                {
                    db.DbConnection.Execute("insert into roles_permissions (role_id,permission_id) values (@RoleId,@PermissionId)", rolePermission);
                }
            }
        }

        public RolePermission TryFind(string roleId, string permissionId)
        {
            ISessionScope sc = _sessionScopeFactory.Find(Thread.CurrentThread);
            if(sc != null)
            {
                using (DataAccessBase db = new DataAccessBase(sc.Connection))
                {
                    return db.DbConnection.QuerySingleOrDefault<RolePermission>("select * from roles_permissions where role_id=@roleId and permission_id=@permissionId", new { roleId, permissionId });
                }
            }
            else
            {
                using (DataAccessBase db = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
                {
                    return db.DbConnection.QuerySingleOrDefault<RolePermission>("select * from roles_permissions where role_id=@roleId and permission_id=@permissionId", new { roleId, permissionId });
                }
            }
        }
    }
}
