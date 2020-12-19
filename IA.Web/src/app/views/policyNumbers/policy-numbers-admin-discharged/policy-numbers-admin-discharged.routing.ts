import { Routes } from "@angular/router";
import { PolicyNumbersAdminDischargedComponent } from "./policy-numbers-admin-discharged.component";



export const PolicyNumbersAdminDischargedRoutes:Routes=[
  {
    path: '',
    children: [
      {
        data:{
          reuseRoute : true,
        },
        path: '',
        component: PolicyNumbersAdminDischargedComponent
      },
    ]
  }
];
