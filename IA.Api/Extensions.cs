using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IA.Api
{
    public static class Extensions
    {
        public static int GetUserId(this System.Security.Principal.IPrincipal user)
        {
            Claim claims = ((ClaimsIdentity)user.Identity).Claims.FirstOrDefault(p => p.Type == ClaimTypes.NameIdentifier);

            return Convert.ToInt32(claims.Value);
        }
        public static string GetRole(this System.Security.Principal.IPrincipal user)
        {
            Claim claims = ((ClaimsIdentity)user.Identity).Claims.FirstOrDefault(p => p.Type == ClaimTypes.Role);

            return claims.Value;
        }
     
    }
}
