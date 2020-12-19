export class ServerSideTotalsDto {
  TotalMoneyValue: number;
  TotalQuantity: number;
  TotalWeight: number;
  TotalPayment: number;
  TotalTraffic: number;
  TotalSaldo: number;
  TotalInvoiceValueWithoutVat: number;
  TotalInvoiceValueWithVat: number;
  TotalPurchaseValueWithoutVat: number;
  TotalPurchaseValueWithVat: number;
  TotalDependentCosts: number;
  TotalTrafficWithoutVat:number;

  constructor() {
      this.TotalMoneyValue = 0;
      this.TotalQuantity = 0;
      this.TotalWeight = 0;
      this.TotalPayment = 0;
      this.TotalTraffic = 0;
      this.TotalSaldo = 0;
      this.TotalInvoiceValueWithoutVat = 0;
      this.TotalInvoiceValueWithVat = 0;
      this.TotalPurchaseValueWithoutVat = 0;
      this.TotalPurchaseValueWithVat = 0;
      this.TotalDependentCosts = 0;
      this.TotalTrafficWithoutVat = 0;
  }
}
