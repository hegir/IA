using IA.Repository.Base;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using IA.Api.Attributes;
using IA.Cache;
using IA.DTOs;
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

        public UsersController(IRepositoryUser repository,
            ILogger<UsersController> logger,
            ISessionManager sessionManager,
            ISecurityProvider securityProvider,
            ICacheProvider cacheProvider
           )
        {
            _repositoryUser = repository;
            _logger = logger;
            _sessionManager = sessionManager;
            _securityProvider = securityProvider;
            _cacheProvider = cacheProvider;
        }

        /// <summary>
        /// Get all users
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("")]
        [Permission("P_USERS")]
        public IActionResult GetAll(int limit, int offset, string sortingField, int order, string searchText, int? cityId)
        {

            return Ok(_repositoryUser.FindAll(limit, offset, sortingField, order, searchText, cityId));
        }

        /// <summary>
        /// Count all users
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("count")]
        [Permission("P_USERS")]
        public IActionResult Count(string searchText, int? cityId)
        {
            return Ok(_repositoryUser.CountAll(searchText, cityId));
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
        /// Change password for user
        /// </summary>
        /// <returns></returns>
        [HttpPut]
        [Route("passwordchange")]
        [Permission("P_USERS_EDIT")]
        public IActionResult PasswordChange([FromBody] PasswordChangeDto passwordChangeDto)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    User user = _repositoryUser.TryFind(User.GetUserId());

                    if (user == null)
                        return NotFound();

                    if (user.PasswordHash != _securityProvider.CreateMD5(passwordChangeDto.OldPassword))
                    {
                        return BadRequest("OLD_PASSWORD_NOT_CORRECT");
                    }

                    if (passwordChangeDto.OldPassword == passwordChangeDto.Password)
                    {
                        return BadRequest("PASSWORD_SAME_AS_OLD");
                    }

                    user.PasswordHash = _securityProvider.CreateMD5(passwordChangeDto.Password);

                    _repositoryUser.Update(user);

                    return Ok(true);
                }
                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Password Change ({Type}) ERROR", passwordChangeDto.GetType());
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

    }
}
