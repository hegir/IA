import { Routes } from '@angular/router';
import { VoucherDetailsComponent } from './voucher-details/voucher-details.component';
import { VoucherComponent } from './voucher.component';



export const VoucherRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: VoucherComponent
      },
      {
        path: ':id',
        component:VoucherDetailsComponent
      }
    ]
  }
];
