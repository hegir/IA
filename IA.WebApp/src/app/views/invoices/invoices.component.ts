import { Component, OnInit } from "@angular/core";
import { RequestService } from "src/app/core/request.service";
import { InvoiceType } from "src/app/enums/invoiceType";
import { Invoice } from "src/app/models/invoice";
import { InvoicesService } from "src/app/services/invoices.service";
import { EnumValues } from 'enum-values';

@Component({
  selector: "app-invoices",
  templateUrl: "./invoices.component.html",
  providers: [InvoicesService, RequestService]
})
export class InvoicesComponent implements OnInit {

  invoices: Invoice[] = new Array();
  totalInvoices: number = 0;

  public InvoiceTypes = EnumValues.getNamesAndValues(InvoiceType);

  constructor(
      private invoicesService: InvoicesService
  ) {
      this.invoicesService.Count().then(total =>{
          this.totalInvoices = total;
          this.invoicesService.Find().then(invoices => {
                  this.invoices = invoices;
        })
    })

}

  ngOnInit() {}

  edit(invoiceId: number)
  {

  }
}
