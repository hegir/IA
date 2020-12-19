import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {TableModule} from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../../../demo-material-module';
import { SharedModule } from '../../../shared/shared.module';
import { DeleteConfirmationDirectiveModule } from '../../../directives/delete.confirmation.module';
import { ArniAutoCompleteModule } from '../../../autocomplete/autocomplete.module';
import { PolicyNumbersAgentObligateRoutes } from './policy-numbers-agent-obligate.routing';
import { PolicyNumbersAgentObligateComponent } from './policy-numbers-agent-obligate.component';



@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    FormsModule,
    RouterModule.forChild(PolicyNumbersAgentObligateRoutes),
    NgxDatatableModule,
    ArniAutoCompleteModule,
    TableModule,
    SharedModule,
    DeleteConfirmationDirectiveModule
  ],
  declarations: [PolicyNumbersAgentObligateComponent]
})
export class PolicyNumbersAgentObligateModule {}
