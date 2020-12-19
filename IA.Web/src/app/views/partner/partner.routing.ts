import { Routes } from '@angular/router';
import { PartnerDetailsComponent } from './partner-details/partner-details.component';
import { PartnerComponent } from './partner.component';




export const PartnerRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: PartnerComponent
      },
      {
        path: ':id',
        component:PartnerDetailsComponent
      }
    ]
  }
];
