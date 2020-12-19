using IA.Notifications.Listener;
using IA.Model;
using IA.Repository;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Linq;

namespace IA.Cache
{
    public class CacheProvider : ICacheProvider
    {
        private readonly IRepositoryRole _repositoryRole;
        private readonly IRepositoryRolePermission _repositoryRolePermission;
        private readonly INotificationManager _notificationManager;

        private List<Role> _roles = new List<Role>();
        private Dictionary<string, List<RolePermission>> _rolePermissions = new Dictionary<string, List<RolePermission>>();


        public CacheProvider(IRepositoryRole repositoryRole,
                                 IRepositoryRolePermission repositoryRolePermission,
                                 INotificationManager notificationManager)
        {
            _repositoryRole = repositoryRole;
            _repositoryRolePermission = repositoryRolePermission;
            _notificationManager = notificationManager;
        }

        public void Start()
        {
            lock (_roles)
            {
                _roles = new List<Role>(_repositoryRole.FindAll());

                lock (_rolePermissions)
                {
                    foreach (Role role in _roles)
                    {
                        _rolePermissions[role.Id] = new List<RolePermission>(_repositoryRolePermission.Find(role.Id));
                    }
                }
            }

            _notificationManager.RegisterListeninigDataCallback("tbl_roles_changed", this, RolesChangedCallback);
            _notificationManager.RegisterListeninigDataCallback("tbl_roles_permissions_changed", this, RolesPermissionsChangedCallback);
        }

        public void Stop()
        {
            _notificationManager.Dispose();
        }

        public bool CheckPermission(string role, string permission)
        {
            lock (_rolePermissions)
            {
                if (_rolePermissions.ContainsKey(role))
                {
                    RolePermission rolePermission = _rolePermissions[role].Find(x => x.PermissionId == permission);
                    if (rolePermission != null)
                        return true;
                }
            }

            return false;
        }

        public List<string> GetPermissions(string role)
        {
            lock (_rolePermissions)
            {
                if (_rolePermissions.ContainsKey(role))
                    return new List<string>(_rolePermissions[role].Select(x => x.PermissionId));
            }

            return new List<string>();
        }

        private void RolesChangedCallback(string listeningSubject, string additionalData)
        {
            string[] data = additionalData.Split(new[] { "##" }, StringSplitOptions.None);
            dynamic roleData = JsonConvert.DeserializeObject(data[1]);

            string roleId = roleData.id;

            lock (_roles)
            {
                Role role = _roles.Find(x => x.Id == roleId);

                if (data[0] == "DELETE")
                {
                    if (role != null)
                        _roles.Remove(role);
                    return;
                }

                if (role == null)
                {
                    role = new Role();
                    role.Id = roleId;
                    _roles.Add(role);
                }

                role.Description = roleData.description;
            }
        }

        private void RolesPermissionsChangedCallback(string listeningSubject, string additionalData)
        {
            string[] data = additionalData.Split(new[] { "##" }, StringSplitOptions.None);
            dynamic rolePermissionData = JsonConvert.DeserializeObject(data[1]);

            string permissionId = rolePermissionData.permission_id;
            string roleId = rolePermissionData.role_id;

            lock (_rolePermissions)
            {
                if (!_rolePermissions.ContainsKey(roleId))
                    _rolePermissions[roleId] = new List<RolePermission>();

                RolePermission rolePermission = _rolePermissions[roleId].Find(x => x.PermissionId == permissionId);

                if (data[0] == "DELETE")
                {
                    if (rolePermission != null)
                        _rolePermissions[roleId].Remove(rolePermission);
                    return;
                }

                if (rolePermission == null)
                {
                    rolePermission = new RolePermission();
                    rolePermission.RoleId = roleId;
                    rolePermission.PermissionId = permissionId;
                    _rolePermissions[roleId].Add(rolePermission);
                }

                rolePermission.RoleId = roleId;
                rolePermission.PermissionId = permissionId;
            }
        }
    }
}
