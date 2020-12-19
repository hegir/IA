import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { TableModule } from 'primeng/table';
import { FormsModule} from '@angular/forms';
import { DemoMaterialModule } from '../../demo-material-module';
import { DeleteConfirmationDirectiveModule } from '../../directives/delete.confirmation.module';
import { SharedModule } from '../../shared/shared.module';
import { ArniAutoCompleteModule } from '../../autocomplete/autocomplete.module';
import { VoucherRoutes } from './voucher.routing';
import { VoucherComponent } from './voucher.component';
import { VoucherDetailsComponent } from './voucher-details/voucher-details.component';




@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    RouterModule.forChild(VoucherRoutes),
    TableModule,
    SharedModule,
    FormsModule,
    ArniAutoCompleteModule,
    DeleteConfirmationDirectiveModule
  ],
  declarations: [VoucherComponent,VoucherDetailsComponent]
})
export class VoucherModule {}
