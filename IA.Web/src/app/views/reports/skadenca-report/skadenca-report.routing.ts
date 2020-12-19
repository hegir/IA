import { Routes } from '@angular/router';
import { SkadencaReportComponent } from './skadenca-report.component';

export const SkadencaReportRoutes: Routes =
    [
        {
            path: '',
            children: [{
                path: '',
                component: SkadencaReportComponent,
                 data: {
                    reuseRoute: true,

                    permissions: {
                        only: 'P_SKADENCA_VIEW'
                    }
                },
            }


    ]
  }
]
