import { Routes } from '@angular/router';
import { CompaniesComponent } from './../companies/companies.component';
import { CompaniesDetailsComponent } from './companies-details/companies-details.component';

export const CompaniesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CompaniesComponent,
        data:{
          permissions : {
            only: 'P_COMPANIES'
          }
        }
      },
      {
        path:':id',
        component: CompaniesDetailsComponent,
        data:{
          permissions: {
            only: 'P_COMPANIES'
          }
        }
      }
    ]
  }
];
