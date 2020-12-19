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
    public class UsersController: ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IRepositoryUser _repositoryUser;
        private readonly ILogger<UsersController> _logger;
        private readonly ISessionManager _sessionManager;
        private readonly ISecurityProvider _securityProvider;
        private readonly ICacheProvider _cacheProvider;

        public UsersController(IRepositoryUser repository,
            ILogger<UsersController> logger,
            ISessionManager sessionManager,
            ISecurityProvider securityProvider,
            ICacheProvider cacheProvider, IHttpContextAccessor httpContextAccessor
           )
        {
            _repositoryUser = repository;
            _logger = logger;
            _sessionManager = sessionManager;
            _securityProvider = securityProvider;
            _cacheProvider = cacheProvider;
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Get all users
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("")]
        [Permission("P_USERS")]
        public  IActionResult GetAll(int limit, int offset, string sortingField, int order, string searchText, int? cityId)
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
        public IActionResult Count( string searchText, int? cityId)
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

        ///// <summary>
        ///// Insert new user
        ///// </summary>
        ///// <returns></returns>
        //[HttpPost]
        //[Route("")]
        //[Permission("P_USERS_EDIT")]
        //public IActionResult Post([FromBody] User entity)
        //{
        //    try
        //    {
        //        if (ModelState.IsValid)
        //        {
        //            if (!string.IsNullOrEmpty(entity.Password))
        //            {
        //                entity.PasswordHash = _securityProvider.CreateMD5(entity.Password);
        //            }
        //            if (!string.IsNullOrEmpty(entity.Username))
        //            {
        //                entity.Username = entity.Username.ToLower();
        //            }
        //            using (var sc = _sessionManager.Create())
        //            {
        //                User existing = _repositoryUser.FindOne(x => x.Username == entity.Username);
        //                User item = _repositoryUser.TryFind(entity.Id);

        //                if (!string.IsNullOrEmpty(entity.PersonalIdentificationNumber))
        //                {
        //                    existing = _repository.FindOne(x => x.PersonalIdentificationNumber == entity.PersonalIdentificationNumber && x.Id != entity.Id);
        //                    if (existing != null)
        //                    {
        //                        sc.Rollback();
        //                        return BadRequest("PERSONAL_IDENTIFICATION_NUMBER_ALREADY_EXIST");
        //                    }
        //                }


        //                if (!string.IsNullOrEmpty(entity.Username))
        //                {
        //                    if ((existing != null && item != null && existing.Id != entity.Id) || (item == null && existing != null))
        //                    {
        //                        sc.Rollback();
        //                        return BadRequest("USERNAME_ALREADY_EXIST");
        //                    }

        //                    if (item == null)
        //                        _repository.Insert(entity, null);
        //                    else
        //                        _repository.Update(entity, null);
        //                }

        //                sc.Commit();
        //            }
        //            return Ok(entity);
        //        }
        //        return BadRequest(ModelState);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Post {{Type}} ERROR", entity.GetType());
        //        return StatusCode(StatusCodes.Status500InternalServerError);
        //    }
        //}
       

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
        [AllowAnonymous]
        public IActionResult PasswordChangeUpdate([FromBody] PasswordChangeDto passwordChangeDto)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    User user = _repositoryUser.TryFind(passwordChangeDto.UserId);
                    if (user.PasswordHash != _securityProvider.CreateMD5(passwordChangeDto.OldPassword))
                    {
                        return BadRequest("OLD_PASSWORD_NOT_CORRECT");
                    }

                    if (passwordChangeDto.Password != passwordChangeDto.RepeatPassword)
                    {
                        return BadRequest("REPEAT_PASSWORD_DOES_NOT_MATCH");
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
