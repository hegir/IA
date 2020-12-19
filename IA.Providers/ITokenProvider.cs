using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

namespace IA.Providers
{
    public interface ITokenProvider
    {
        string GenerateToken(IEnumerable<Claim> claims, string serverKey, string tokenIssuer, DateTime expirationTime);

        bool ValidateToken(string token, string serverKey, string tokenIssuer, out int userId);
    }
}
