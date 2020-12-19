using System;
using System.ComponentModel.DataAnnotations;

namespace IA.Api.Models
{
    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }

        [Required]
        public string GrantType { get; set; }
        public string RefreshToken { get; set; }
    }
}
