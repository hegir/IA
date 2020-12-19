import { Routes } from '@angular/router';
import { PremiumAnalysisReportComponent } from './premium-analysis-report.component';

export const PremiumAnalysisReportRoutes: Routes =
    [
        {
            path: '',
            children: [{
                path: '',
                component: PremiumAnalysisReportComponent,
                 data: {
                    reuseRoute: true,

                    permissions: {
                        only: 'P_PREMIUM_ANALYSIS_REPORT_VIEW'
                    }
                },
            }


    ]
  }
]
