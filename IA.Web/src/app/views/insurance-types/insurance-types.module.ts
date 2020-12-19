import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import {InsuranceTypesComponent} from './insurance-types.component'
import { InsuranceTypesRoutes } from './insurance-types.routing';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule} from '@angular/forms';
import { DeleteConfirmationDirectiveModule } from '../../directives/delete.confirmation.module';
import { InsuranceTypesDetailsComponent } from './insurance-types-details/insurance-types-details.component';




@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    RouterModule.forChild(InsuranceTypesRoutes),
    TableModule,
    SharedModule,
    FormsModule,
    DeleteConfirmationDirectiveModule
  ],
  declarations: [InsuranceTypesComponent, InsuranceTypesDetailsComponent]
})
export class InsuranceTypesModule {}
