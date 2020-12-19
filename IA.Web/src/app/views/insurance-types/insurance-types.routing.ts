import { Routes } from '@angular/router';
import { InsuranceTypesDetailsComponent } from './insurance-types-details/insurance-types-details.component';
import {InsuranceTypesComponent } from './insurance-types.component'


export const InsuranceTypesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        data : {
          permissions : {
            only : 'P_INSURANCE_TYPES_VIEW'
          }
        },
        path: '',
        component: InsuranceTypesComponent
      },
      {
        path: ':id',
        component: InsuranceTypesDetailsComponent
      }
    ]
  }
];
