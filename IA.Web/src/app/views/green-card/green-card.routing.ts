import { Routes } from '@angular/router';
import { GreenCardDetailsComponent } from './green-card-details/green-card-details.component';
import { GreenCardComponent } from './green-card.component';


export const GreenCardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        data : {
          reuseRoute : true,
          permissions : {
            only : 'P_GREEN_CARDS_VIEW'
          }
        },
        path: '',
        component: GreenCardComponent
      },
      {
        path: ':id',
        component: GreenCardDetailsComponent
      }
    ]
  }
];
