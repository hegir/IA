import { Routes } from '@angular/router';
import { ObligatedDischargedReportComponent } from './obligated-discharged-report.component';

export const ObligateDischargedRoutes: Routes =
    [
        {
            path: '',
            children: [{
                path: '',
                component: ObligatedDischargedReportComponent,
                 data: {
                    reuseRoute: true,

                    permissions: {
                        only: 'P_OBLIGATED_DISCHARGED_REPORT_VIEW'
                    }
                },
            }


    ]
  }
]
