import { Routes } from '@angular/router';
import { ObligatedDischargedReportAdminComponent } from './obligated-discharged-report-admin.component';

export const ObligateDischargedAdminRoutes: Routes =
    [
        {
            path: '',
            children: [{
                path: '',
                component: ObligatedDischargedReportAdminComponent,
                 data: {
                    reuseRoute: true,

                    permissions: {
                        only: 'P_ADMIN_OBLIGED_DISCHARGED_REPORT_VIEW '
                    }
                },
            }


    ]
  }
]
