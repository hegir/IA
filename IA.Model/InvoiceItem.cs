using IA.Enums;
using IA.Model.Base;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IA.Model
{
    [Table("invoice_items")]
    public class InvoiceItem : IEntity<int>
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("quantity")]
        public double Quantity { get; set; }

        [Column("price")]
        public double Price { get; set; }

        [Column("rabat")]
        public double? Rabat { get; set; }

        [Column("invoice_id")]
        public int InvoiceId { get; set; }

        [NotMapped]
        public double PriceWithoutVat
        {
            get
            {
               return Price * Quantity;
            }
        }

        [NotMapped]
        public double RabatValue
        {
            get
            {
                if (Rabat.HasValue)
                    return Math.Round((Rabat.Value / 100), 2) * PriceWithoutVat;
                return 0;
            }
        }

        [NotMapped]
        public double PriceWithRabatWithoutVat
        {
            get
            {
                if (Rabat.HasValue)
                    return PriceWithoutVat - RabatValue;
                return PriceWithoutVat;
            }
        }

        [NotMapped]
        public double VatValue
        {
            get
            {
                return Math.Round(PriceWithRabatWithoutVat * 0.17, 2);
            }
        }

        [NotMapped]
        public double Total
        {
            get
            {
                return PriceWithRabatWithoutVat + VatValue;
            }
        }

    }
}
