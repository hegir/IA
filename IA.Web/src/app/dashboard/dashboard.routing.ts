import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';


export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        data : {
          reuseRoute : true,
        },
        path: '',
        component: DashboardComponent
      },
    ]
  }
];
