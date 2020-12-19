import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UsersDetailsComponent } from './users-details/users-details.component';

export const UsersRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: UsersComponent,
        data:{
          reuseRoute : true,
          permissions : {
            only: 'P_USERS'
          }
        }
      },
      {
        path:':id',
        component: UsersDetailsComponent,
        data:{
          permissions: {
            only: 'P_USERS'
          }
        }
      }
    ]
  }
];
