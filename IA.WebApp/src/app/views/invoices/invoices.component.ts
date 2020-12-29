import { Component, OnInit } from "@angular/core";
import { RequestService } from "src/app/core/request.service";
import { InvoiceType } from "src/app/enums/invoiceType";
import { Invoice } from "src/app/models/invoice";
import { InvoicesService } from "src/app/services/invoices.service";
import { EnumValues } from 'enum-values';
import { InvoiceStatus } from "src/app/enums/invoiceStatus";
import { Router } from "@angular/router";
import { NotificationsService } from "src/app/core/notifications.service";

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
      private router: Router,
      private notificationService: NotificationsService
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

  remove(invoiceId: number)
  {
    this.invoicesService.Delete(invoiceId.toString()).then(res =>{
      if(res != null)
      {
        this.notificationService.success("REMOVED_SUCCESS");
        this.invoices.splice(this.invoices.findIndex(x=> x.Id == invoiceId), 1)
      }
    })
  }
}
