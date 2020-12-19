import { Routes } from '@angular/router';
import { SpecificationsReportComponent } from './specifications.report.component';

export const SpecificationsReportRoutes: Routes =
    [
        {
            path: '',
            children: [{
                path: '',
                component: SpecificationsReportComponent,
                 data: {
                    reuseRoute: true,

                    permissions: {
                        only: 'P_SPECIFICATIONS_VIEW'
                    }
                },
            }


    ]
  }
]
