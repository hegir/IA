import { Routes } from '@angular/router';
import { ContractedComissionDetailsComponent } from './contracted-comission-details/contracted-comission-details.component';
import { ContractedComissionComponent } from './contracted-comission.component';



export const ContractedComissionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ContractedComissionComponent
      },
      {
        path: ':id',
        component:ContractedComissionDetailsComponent
      }
    ]
  }
];
