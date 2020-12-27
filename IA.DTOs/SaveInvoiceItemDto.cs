using IA.Model;

namespace IA.DTOs
{
    public class SaveInvoiceItemDto
    {
        public Invoice Invoice { get; set; }
        public InvoiceItem InvoiceItem { get; set; }
    }
}
