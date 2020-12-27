import { Component, OnInit } from "@angular/core";
import { RequestService } from "src/app/core/request.service";
import { InvoiceType } from "src/app/enums/invoiceType";
import { Invoice } from "src/app/models/invoice";
import { InvoicesService } from "src/app/services/invoices.service";
import { EnumValues } from 'enum-values';
import { InvoiceStatus } from "src/app/enums/invoiceStatus";
import { Router } from "@angular/router";

@Component({
  selector: "app-invoices",
  templateUrl: "./invoices.component.html",
  providers: [InvoicesService, RequestService]
})
export class InvoicesComponent implements OnInit {

  invoices: Invoice[] = new Array();
  totalInvoices: number = 0;

  public InvoiceTypes = EnumValues.getNamesAndValues(InvoiceType);
  public InvoiceStatuses = EnumValues.getNamesAndValues(InvoiceStatus);
  
  constructor(
      private invoicesService: InvoicesService,
      private router: Router
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
    this.router.navigate([`invoices/${invoiceId}`])
  }
}
