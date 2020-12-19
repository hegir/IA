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
import { PartnerComponent } from './partner.component';
import { PartnerDetailsComponent } from './partner-details/partner-details.component';
import { PartnerRoutes } from './partner.routing';




@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    RouterModule.forChild(PartnerRoutes),
    TableModule,
    SharedModule,
    FormsModule,
    ArniAutoCompleteModule,
    DeleteConfirmationDirectiveModule
  ],
  declarations: [PartnerComponent, PartnerDetailsComponent]
})
export class PartnerModule {}
