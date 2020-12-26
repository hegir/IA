using IA.Enums;
using IA.Model.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IA.Model
{
    [Table("invoices")]
    public class Invoice : IEntity<int>
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("type")]
        public InvoiceType Type { get; set; }

        [Column("invoice_number")]
        public string InvoiceNumber { get; set; }

        [Column("partner_name")]
        public string PartnerName { get; set; }

        [Column("added")]
        public DateTime Added { get; set; }

        [Column("added_by")]
        public int AddedBy { get; set; }

        [Column("status")]
        public InvoiceStatus Status{ get; set; }

        [Column("note")]
        public string Note { get; set; }

        [NotMapped]
        public List<InvoiceItem> Items { get; set; }

        [NotMapped]
        public InvoiceAction? Action { get; set; }


        #region Methods

        public void SetStatus()
        {
            if(Id == 0)
            {
                Status = InvoiceStatus.Created;
                return;
            }
            else if(Action.HasValue)
            {
                switch(Action.Value)
                {
                    case InvoiceAction.Approve:
                        Status = InvoiceStatus.Approved;
                        return;
                    case InvoiceAction.Update:
                    default:
                        return;
                }
            }
            else
            {
                Status = InvoiceStatus.Created;
                return;
            }
        }
        #endregion
    }
}
