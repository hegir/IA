using System;
using System.Collections.Generic;
using System.Security.Claims;
using IA.Repository.Base;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using IA.Api.Models;
using IA.DTOs;
using IA.Enums;
using IA.Model;
using IA.Providers;
using IA.Repository;
using AI.DTOs;

namespace IA.Api.Controllers
{
    [Route("api/tokens")]
    [ApiController]
    public class TokensController : ControllerBase
    {
        IRepositoryUser _repositoryUser;
        IRepositoryRefreshToken _repositoryRefreshToken;
        ITokenProvider _tokenProvider;
        ISecurityProvider _securityProvider;
        ISessionManager _sessionManager;
        ILogger<TokensController> _logger;
        IConfiguration _configuration;

        public TokensController(IRepositoryUser repositoryUser, IRepositoryRefreshToken repositoryRefreshToken, ITokenProvider tokenProvider,ISecurityProvider securityProvider,
            ISessionManager sessionManager,ILogger<TokensController> logger,IConfiguration configuration)
        {
            _repositoryUser = repositoryUser;
            _repositoryRefreshToken = repositoryRefreshToken;
            _tokenProvider = tokenProvider;
            _securityProvider = securityProvider;
            _sessionManager = sessionManager;
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("")]
        public IActionResult Token([FromBody] LoginModel parameters)
        {
            using (ISessionScope sc = _sessionManager.Create())
            {
                User user = null;
                AuthTokenDto token;
                try
                {
                    switch (parameters.GrantType)
                    {
                        case "password":
                            
                            user = _repositoryUser.FindOne(x => x.Username == parameters.Username.ToLower() && x.PasswordHash == _securityProvider.CreateMD5(parameters.Password));
                          
                            if(user == null)
                            {
                                sc.Rollback();
                                return BadRequest("USERNAME_OR_PASSWORD_INVALID");
                            }
                            if(user.Status == UserStatus.Disabled)
                            {
                                sc.Rollback();
                                return BadRequest("USER_IS_NOT_ACTIVE");
                            }
                            token = CreateTokenAndRefreshToken(user);
                            sc.Commit();
                            return Ok(token);
                        case "refresh_token":
                            if(string.IsNullOrEmpty(parameters.RefreshToken))
                            {
                                sc.Rollback();
                                return BadRequest("REFRESH_TOKEN_IS_MISSING");
                            }
                            RefreshToken refreshToken = _repositoryRefreshToken.FindOne(x => x.Id == parameters.RefreshToken);
                            if(refreshToken == null)
                            {
                                sc.Rollback();
                                return BadRequest("REFRESH_TOKEN_DOES_NOT_EXIST");
                            }
                            if(refreshToken.ExpireIn < DateTime.UtcNow)
                            {
                                _repositoryRefreshToken.Delete(parameters.RefreshToken);
                                sc.Commit();
                                return BadRequest("REFRESH_TOKEN_EXPIRED");
                            }
                            user = _repositoryUser.FindOne(x => x.Id == refreshToken.UserId);
                            token = CreateTokenAndRefreshToken(user);
                            sc.Commit();
                            return Ok(token);

                        default: sc.Commit(); return BadRequest();

                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Token error");
                    sc.Rollback();
                }
            }
            return BadRequest("TOKEN_ERROR");


        }

        private AuthTokenDto CreateTokenAndRefreshToken(User user)
        {
            AuthTokenDto token = new AuthTokenDto();
            List<Claim> claims = new List<Claim>();

            claims.Add(new Claim(ClaimTypes.Name, !string.IsNullOrEmpty(user.Username) ? user.Username : string.Empty));
            claims.Add(new Claim(ClaimTypes.Role, user.RoleId));
            claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));
            claims.Add(new Claim("username", !string.IsNullOrEmpty(user.Username) ? user.Username : string.Empty));
            claims.Add(new Claim("user_id", user.Id.ToString()));
            claims.Add(new Claim("full_name", user.FullName));
            claims.Add(new Claim("company_id", user.CompanyId.ToString()));

            DateTime issuedAt = DateTime.UtcNow;
            DateTime validTo = issuedAt.AddMinutes(_configuration.GetValue<int>("Token:ExpirationTime"));

            token.ExpiresIn = (validTo - issuedAt).TotalSeconds;
            token.Token = _tokenProvider.GenerateToken(claims, _configuration.GetValue<string>("Token:ServerKey"), _configuration.GetValue<string>("Token:Issuer"), validTo);
            token.RefreshToken = Guid.NewGuid().ToString("N");

            _repositoryRefreshToken.DeleteAll(user.Id);

            RefreshToken refreshToken = new RefreshToken();
            refreshToken.Id = token.RefreshToken;
            refreshToken.ExpireIn = DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("Token:RefreshTime"));
            refreshToken.IssuedAt = issuedAt;
            refreshToken.UserId = user.Id;
            refreshToken.Token = token.Token;

            
            
            _repositoryRefreshToken.Insert(refreshToken);

            return token;

        }

    }
}
