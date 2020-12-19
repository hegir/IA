import { Routes } from '@angular/router';
import { ColorDetailsComponent } from './color-details/color-details.component';
import { ColorComponent } from './color.component';



export const ColorsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        data : {
          permissions : {
            only : 'P_COLORS_VIEW'
          }
        },
        path: '',
        component: ColorComponent
      },
      {
        path: ':id',
        component: ColorDetailsComponent
      }
    ]
  }
];
