import { Routes } from '@angular/router';
import { PremiumComponent} from './premium.component'
export const PremiumReportRoutes: Routes =
    [
        {
            path: '',
            children: [{
                path: '',
                component: PremiumComponent,
                 data: {
                    permissions: {
                        only: 'P_PREMIUM_REPORT'
                    }
                },
            }


    ]
  }
]
