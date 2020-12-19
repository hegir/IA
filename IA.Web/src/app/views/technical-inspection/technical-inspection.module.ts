import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { TableModule } from 'primeng/table';
import { FormsModule} from '@angular/forms';
import { TechnicalInspectionComponent } from './technical-inspection.component';
import { TechnicalInspectionDetailsComponent } from './technical-inspection-details/technical-inspection-details.component';
import { TechnicalInspectionRoutes } from './technical-inspection.routing';
import { DemoMaterialModule } from '../../demo-material-module';
import { DeleteConfirmationDirectiveModule } from '../../directives/delete.confirmation.module';
import { SharedModule } from '../../shared/shared.module';
import { ArniAutoCompleteModule } from '../../autocomplete/autocomplete.module';




@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    RouterModule.forChild(TechnicalInspectionRoutes),
    TableModule,
    SharedModule,
    FormsModule,
    ArniAutoCompleteModule,
    DeleteConfirmationDirectiveModule
  ],
  declarations: [TechnicalInspectionComponent, TechnicalInspectionDetailsComponent]
})
export class TechnicalInspectionModule {}
