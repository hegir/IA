import { InvoiceAction } from "../enums/invoiceAction";
import { InvoiceStatus } from "../enums/invoiceStatus";
import { InvoiceType } from "../enums/invoiceType";
import { InvoiceItem } from "./invoiceItem";

export class Invoice {
    Id: number;
    Type: InvoiceType;
    InvoiceNumber: string;
    PartnerName: string;
    Added: Date;
    AddedBy: number;
    Status: InvoiceStatus;
    Note: string;
    Items: InvoiceItem[];
    Action: InvoiceAction | null;

    PriceWithoutVat: number;
    RabatValue: number;
    PriceWithRabatWithoutVat: number;
    VatValue: number;
    Total: number;
}