import { Routes } from "@angular/router";
import { PolicyDetailsComponent } from "./policy-details/policy-details.component";
import { PolicyPaymentsComponent } from "./policy-payments/policy-payments.component";
import { PolicyComponent } from "./policy.component";



export const PolicyRoutes:Routes=[
  {
    path: '',
    children: [
      {
        data:{
          reuseRoute : true,
        },
        path: '',
        component: PolicyComponent
      },
      {
        path: ':id',
        component:PolicyDetailsComponent
      },
      {
        path: ':id/payments',
        component:PolicyPaymentsComponent
      }
    ]
  }
];
