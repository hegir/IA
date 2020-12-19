using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace IA.Providers
{
    public class TokenProvider : ITokenProvider
    {
        public string GenerateToken(IEnumerable<Claim> claims, string serverKey, string tokenIssuer, DateTime expirationTime)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(serverKey));

            var jwt = new JwtSecurityToken(
                issuer: tokenIssuer,
                audience: "Everyone",
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: expirationTime,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
                );
            

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }

        public bool ValidateToken(string token, string serverKey, string tokenIssuer, out int userId)
        {
            userId = 0;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(serverKey));

            SecurityToken validatedToken;
            var validator = new JwtSecurityTokenHandler();

            TokenValidationParameters validationParameters = new TokenValidationParameters
            {
                ValidIssuer = tokenIssuer,
                ValidAudience = "Everyone",
                IssuerSigningKey = key,
                ValidateIssuerSigningKey = true,
                ValidateAudience = true
            };

            if (validator.CanReadToken(token))
            {
                ClaimsPrincipal principal;
                try
                {
                    principal = validator.ValidateToken(token, validationParameters, out validatedToken);
                    if(validatedToken != null && validatedToken.ValidTo > DateTime.UtcNow)
                    {
                        userId = Convert.ToInt32(principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
                        return true;
                    }
                    return false;
                }
                catch 
                {
                    return false;
                   
                }
            }
            return false;
        }
    }
}
