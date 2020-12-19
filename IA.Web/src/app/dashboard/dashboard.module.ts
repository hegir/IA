import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardsRoutes } from './dashboard.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { DashboardComponent } from './dashboard.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ArniAutoCompleteModule } from '../autocomplete/autocomplete.module';
import { DeleteConfirmationDirectiveModule } from '../directives/delete.confirmation.module';
@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    RouterModule.forChild(DashboardsRoutes),
    NgxDatatableModule,
    TableModule,
    SharedModule,
    DeleteConfirmationDirectiveModule,
    FormsModule,
    ArniAutoCompleteModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardsModule {}
