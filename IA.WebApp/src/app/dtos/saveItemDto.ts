import { Invoice } from "../models/invoice";
import { InvoiceItem } from "../models/invoiceItem";

export class SaveInvoiceItemDto
{
    Invoice: Invoice;
    InvoiceItem: InvoiceItem;
}