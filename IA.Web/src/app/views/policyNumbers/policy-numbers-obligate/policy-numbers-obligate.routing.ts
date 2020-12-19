import { Routes } from "@angular/router";
import { PolicyNumbersObligateComponent } from "./policy-numbers-obligate.component";



export const PolicyNumbersObligateRoutes:Routes=[
  {
    path: '',
    children: [
      {
        path: '',
        component: PolicyNumbersObligateComponent
      }
    ]
  }
];
