import { Routes } from '@angular/router';
import {CitiesComponent } from '../cities/cities.component';
import { CitiesDetailsComponent } from './cities-details/cities-details.component';


export const CitiesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CitiesComponent
      },
      {
        path: ':id',
        component: CitiesDetailsComponent
      }
    ]
  }
];
