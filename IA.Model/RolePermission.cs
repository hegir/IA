using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IA.Model
{
    [Table("roles_permissions")]
    public class RolePermission
    {
        [Key]
        [Column("role_id")]
        public string RoleId { get; set; }
        [Key]
        [Column("permission_id")]
        public string PermissionId { get; set; }
    }
}
