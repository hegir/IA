export class InvoiceItem {
    Id: number;
    Name: string;
    Quantity: number;
    Price: number;
    Rabat: number | null;
    InvoiceId: number;
    VatPercentage: number;
    PriceWithoutVat: number;
    RabatValue: number;
    PriceWithRabatWithoutVat: number;
    VatValue: number;
    Total: number;
}