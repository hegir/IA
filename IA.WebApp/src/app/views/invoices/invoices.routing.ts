import { Routes } from "@angular/router";
import { InvoiceDetailsComponent } from "./details/invoice-details.component";
import { InvoicesComponent } from "./invoices.component";


export const InvoicesRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: InvoicesComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: ":id",
        component: InvoiceDetailsComponent
      }
    ]
  }
];
