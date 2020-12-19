using IA.Model.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace IA.Model
{
    [Table("refresh_tokens")]
   public class RefreshToken : IEntity<string>
    {
        [Key]
        [Column("id")]
        public string Id { get; set; }

        [Column("expire_in")]
        public DateTime ExpireIn { get; set; }

        [Column("issued_at")]
        public DateTime IssuedAt { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("token")]
        public string Token { get; set; }
    }
}
