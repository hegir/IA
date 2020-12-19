import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { TableModule } from 'primeng/table';
import { FormsModule} from '@angular/forms';
import { ContractedComissionRoutes } from './contracted-comission.routing';
import { DeleteConfirmationDirectiveModule } from '../../../directives/delete.confirmation.module';
import { DemoMaterialModule } from '../../../demo-material-module';
import { SharedModule } from '../../../shared/shared.module';
import { ContractedComissionComponent } from './contracted-comission.component';
import { ContractedComissionDetailsComponent } from './contracted-comission-details/contracted-comission-details.component';




@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    RouterModule.forChild(ContractedComissionRoutes),
    TableModule,
    SharedModule,
    FormsModule,
    DeleteConfirmationDirectiveModule
  ],
  declarations: [ContractedComissionComponent, ContractedComissionDetailsComponent]
})
export class ContractedComissionsModule {}
