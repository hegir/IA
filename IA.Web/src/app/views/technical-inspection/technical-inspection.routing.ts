import { Routes } from '@angular/router';
import { TechnicalInspectionDetailsComponent } from './technical-inspection-details/technical-inspection-details.component';
import { TechnicalInspectionComponent } from './technical-inspection.component';



export const TechnicalInspectionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TechnicalInspectionComponent
      },
      {
        path: ':id',
        component:TechnicalInspectionDetailsComponent
      }
    ]
  }
];
