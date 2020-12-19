using IA.Model.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IA.Model
{
    [Table("cities")]
    public class City : IEntity<int>
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("municipality_code")]
        public string MunicipalityCode { get; set; }

        [Column("post_code")]
        public string PostCode { get; set; }

        [Column("canton_id")]
        public int CantonId { get; set; }

        [NotMapped]
        public string CantonName { get; set; }

        [NotMapped]
        public string CityNameMunicipalityCode { get; set; }
    }
}
