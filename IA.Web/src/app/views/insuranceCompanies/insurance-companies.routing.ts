import { Routes } from '@angular/router';
import {InsuranceCompanyComponent } from './insurance-companies.component';
import { InsuranceCompanyDetailsComponent } from './insurance-company-details/insurance-company-details.component';
import { InsuranceCompanyMainOfficeDetailsComponent } from './insurance-company-main-office-details/insurance-company-main-office-details.component';


export const InsuranceCompanyRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: InsuranceCompanyComponent
      },
      {
        path: ':id',
        component: InsuranceCompanyDetailsComponent
      },
      {
        path: ':insuranceId/mainoffices/:mainOfficeid',
        component : InsuranceCompanyMainOfficeDetailsComponent
      }
    ]
  }
];
