using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IA.Repository.Base;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using IA.Api.Attributes;
using IA.Model;
using IA.Repository;

namespace IA.Api.Controllers
{
    [Route("api/roles/{roleId}/permissions")]
    [ApiController]
    [Authorize]
    public class RolesPermissionsController : ControllerBase
    {
        private readonly ISessionManager _sessionManager;
        private readonly ILogger _logger;
        private readonly IRepositoryRolePermission _repositoryRolePermission;
        private readonly IRepositoryPermission _repositoryPermission;

        public RolesPermissionsController(IRepositoryRolePermission repositoryRolePermission,
                                          IRepositoryPermission repositoryPermission,
                                          ISessionManager sessionManager,
                                          ILogger<RolesPermissionsController> logger)
        {
            _sessionManager = sessionManager;
            _logger = logger;
            _repositoryRolePermission = repositoryRolePermission;
            _repositoryPermission = repositoryPermission;
        }
        /// <summary>
        /// Insert new RolePermission
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("")]
        [Permission("P_ROLES_PERMISSIONS_EDIT")]
        public IActionResult Post([FromBody] RolePermission entity, string roleId)
        {
            try
            {
                entity.RoleId = roleId;
                if (ModelState.IsValid)
                {
                    using (var sc = _sessionManager.Create())
                    {
                        var item = _repositoryRolePermission.TryFind(entity.RoleId, entity.PermissionId);

                        if (item != null)
                            return BadRequest("ROLE_PERMISSION_ALREADY_ADDED");
                        else
                            _repositoryRolePermission.Insert(entity);

                        sc.Commit();
                    }
                    return Ok(entity);
                }
                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Post{{Type}} ERROR", entity.GetType());
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        /// <summary>
        /// Get all Permissions by RoleId
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("")]
        [Permission("P_ROLES_PERMISSIONS")]
        public IActionResult Get(string roleId)
        {
            try
            {
                IEnumerable<RolePermission> rolePermissions;
                IEnumerable<Permission> permissions;
                rolePermissions = _repositoryRolePermission.Find(roleId);
                permissions = _repositoryPermission.Find(rolePermissions.Select(x => x.PermissionId).ToList());
                return Ok(permissions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetByRole{{ID}} ERROR", roleId);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
        /// <summary>
        /// Delete Permission for Role by PermissionId
        /// </summary>
        /// <returns></returns>
        [HttpDelete]
        [Route("{permissionId}")]
        [Permission("P_ROLES_PERMISSIONS_EDIT")]
        public IActionResult Delete(string roleId, string permissionId)
        {
            try
            {
                using (var sc = _sessionManager.Create())
                {
                    try
                    {
                        RolePermission item = _repositoryRolePermission.TryFind(roleId, permissionId);
                        if (item == null)
                            return NotFound();
                        _repositoryRolePermission.Delete(item);
                    }
                    finally
                    {
                        sc.Commit();
                    }
                    return Ok(true);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Delete {{ID}} ERROR");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
