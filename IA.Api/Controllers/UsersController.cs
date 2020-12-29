using IA.Repository.Base;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using IA.Api.Attributes;
using IA.Cache;
using IA.Model;
using IA.Providers;
using IA.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IA.Api.Controllers
{
    [Route("/api/users")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IRepositoryUser _repositoryUser;
        private readonly ILogger<UsersController> _logger;
        private readonly ISessionManager _sessionManager;
        private readonly ISecurityProvider _securityProvider;
        private readonly ICacheProvider _cacheProvider;
        private readonly IRepositoryRefreshToken _repositoryRefreshToken;

        public UsersController(IRepositoryUser repository,
            ILogger<UsersController> logger,
            ISessionManager sessionManager,
            ISecurityProvider securityProvider,
            ICacheProvider cacheProvider,
            IRepositoryRefreshToken repositoryRefreshToken
           )
        {
            _repositoryUser = repository;
            _logger = logger;
            _sessionManager = sessionManager;
            _securityProvider = securityProvider;
            _cacheProvider = cacheProvider;
            _repositoryRefreshToken = repositoryRefreshToken;
        }

        /// <summary>
        /// Get user by id
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("{id:int}")]
        [Permission("P_USERS")]
        public IActionResult Get(int id)
        {
            return Ok(_repositoryUser.TryFind(id));
        }

        /// <summary>
        /// Registration request
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("")]
        [AllowAnonymous]
        public IActionResult Post([FromBody] User entity)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (!string.IsNullOrEmpty(entity.Password))
                    {
                        entity.PasswordHash = _securityProvider.CreateMD5(entity.Password);
                    }
                    if (!string.IsNullOrEmpty(entity.Email))
                    {
                        entity.Email = entity.Email.ToLower();
                    }
                    using (var sc = _sessionManager.Create())
                    {
                        if (_repositoryUser.FindOne(x => x.Email == entity.Email) != null)
                            return BadRequest("USER_WITH_EMAIL_ALREADY_EXISTS");

                        entity.SetDefaults();
                        _repositoryUser.Insert(entity);

                        sc.Commit();
                    }
                    return Ok(entity);
                }
                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Post {{Type}} ERROR", entity.GetType());
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }


        /// <summary>
        /// Get permissions for authorized user
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("permissions")]
        public async Task<IActionResult> GetPermissions()
        {
            try
            {
                string role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role).Value;
                List<string> permissions = new List<string>();

                await Task.Run(() =>
                {
                    permissions.AddRange(_cacheProvider.GetPermissions(role));
                });

                permissions = permissions.Distinct().ToList();

                return Ok(permissions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetPermissions ERROR");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }


        /// <summary>
        /// User log out. This action will delete all valid refresh tokens for the user.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("logout")]
        public IActionResult LogOut()
        {
            try
            {
                using (var sc = _sessionManager.Create())
                {
                    _repositoryRefreshToken.DeleteAll(User.GetUserId());
                    sc.Commit();
                }
                return Ok(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "LogOut() ERROR");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
