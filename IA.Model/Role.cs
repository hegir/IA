using IA.Model.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IA.Model
{
    [Table("roles")]
    public class Role : IEntity<string>
    {
        [Key]
        [Column("id")]
        public string Id { get; set; }

        [Column("description")]
        public string Description { get; set; }
    }
}
