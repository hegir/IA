import { Routes } from "@angular/router";
import { VoucherObligateComponent } from "./voucher-obligate.component";



export const VoucherObligateRoutes:Routes=[
  {
    path: '',
    children: [
      {
        path: '',
        component: VoucherObligateComponent
      }
    ]
  }
];
