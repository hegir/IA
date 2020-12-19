import { Routes } from '@angular/router';
import {PolicyHoldersComponent } from './policy-holders.component';
import { PolicyHolderDetailsComponent } from './policy-holder-details/policy-holder-details.component';


export const PolicyHoldersRoutes: Routes = [
  {
    path: '',
    children: [
      {data:{
        reuseRoute : true,
      },
        path: '',
        component: PolicyHoldersComponent
      },
      {
        path: ':id',
        component: PolicyHolderDetailsComponent
      }
    ]
  }
];
