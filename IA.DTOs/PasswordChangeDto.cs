using System.ComponentModel.DataAnnotations;

namespace IA.DTOs
{
    public class PasswordChangeDto
    {
        public int UserId { get; set; }
        [RegularExpression(@"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\()\[\]-]{8,}$", ErrorMessage = "PASSWORD_FORMAT_ERROR")]
        public string Password { get; set; }
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,.>])[A-Za-z\d!@#$%^&*()-_=+{};:,.>]{6,}$", ErrorMessage = "PASSWORD_FORMAT_ERROR")]
        public string RepeatPassword { get; set; }
        public string OldPassword { get; set; }
    }
}
