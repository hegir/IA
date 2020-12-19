import { Routes } from '@angular/router';
import { RolesComponent } from './roles.component';
import { RolesDetailsComponent } from './roles-details/roles-details.component';


export const RolesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: RolesComponent
      },
      {
        path:':id',
        component: RolesDetailsComponent
      }
    ]
  }
];
