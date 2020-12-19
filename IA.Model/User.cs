using IA.Model.Base;
using IA.Enums;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IA.Model
{
    [Table("users")]
    public class User: IEntity<int>
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("first_name")]
        [Required]
        public string FirstName { get; set; }

        [Required]
        [Column("last_name")]
        public string LastName { get; set; }

        [Column("email")]
        [RegularExpression(@"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$", ErrorMessage = "EMAIL_FORMAT_IS_INVALID")]
        public string Email { get; set; }

        [Column("password_hash")]
        public string PasswordHash { get; set; }

        [Required]
        [Column("status")]
        public UserStatus Status { get; set; }

        [Required]
        [Column("role_id")]
        public string RoleId { get; set; }

        [Column("birth_date")]
        public DateTime BirthDate { get; set; }

        [Column("phone_number")]
        [RegularExpression(@"^[+]?[0-9-/]*$", ErrorMessage = "MOBILE_PHONE_NUMBER_IS_INVALID")]
        public string PhoneNumber { get; set; }

        [Column("city_id")]
        public int CityId { get; set; }

        [Column("gender")]
        public Gender Gender { get; set; }

        [NotMapped]
        public string CityName { get; set; }

        [Column("address")]
        public string Address { get; set; }

        [NotMapped]
        public string FullName { get { return FirstName + " " + LastName; } }


        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,.>])[A-Za-z\d!@#$%^&*()-_=+{};:,.>]{6,}$", ErrorMessage = "PASSWORD_FORMAT_ERROR_EXPRESION")]
        [NotMapped]
        public string Password { get; set; }

        [NotMapped]
        public string CityNameMunicipalityCode { get; set; }


    }
}
