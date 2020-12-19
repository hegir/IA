import { Routes } from '@angular/router';
import {MainOfficesComponent } from './main-offices.component';
import { MainOfficesDetailsComponent } from './main-offices-details/main-offices-details.component';


export const MainOfficesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        data : {
          reuseRoute : true,
          permissions : {
            only : 'P_MAIN_OFFICES_VIEW'
          }
        },
        path: '',
        component: MainOfficesComponent
      },
      {
        path: ':id',
        component: MainOfficesDetailsComponent
      }
    ]
  }
];
