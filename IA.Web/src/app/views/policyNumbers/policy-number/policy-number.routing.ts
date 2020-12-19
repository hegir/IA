import { Routes } from "@angular/router";
import { PolicyNumberDetailsComponent } from "../policy-number-details/policy-number-details/policy-number-details.component";
import { PolicyNumberComponent } from "./policy-number.component";



export const PolicyNumberRoutes:Routes=[
  {
    path: '',
    children: [
      {
        data:{
          reuseRoute : true,
        },
        path: '',
        component: PolicyNumberComponent
      },
      {
        path: ':id',
        component:PolicyNumberDetailsComponent
      }
    ]
  }
];
