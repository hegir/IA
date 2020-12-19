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
import { ContextMenuModule } from 'primeng/primeng'
import { AgentsSearchComponent } from '../../users/agentsSearchDialog/agents-search/agents-search.component';
import { ArniAutoCompleteModule } from '../../../autocomplete/autocomplete.module';
import { GreenCardsObligateRoutes } from './green-cards-obilgate.routing';
import { GreenCardsObligateComponent } from './green-cards-obligate.component';
import { AgentsSearchModule } from '../../users/agentsSearchDialog/agents-search/agents-search.module';




@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    FormsModule,
    RouterModule.forChild(GreenCardsObligateRoutes),
    NgxDatatableModule,
    TableModule,
    SharedModule,
    DeleteConfirmationDirectiveModule,
    ContextMenuModule,
    ArniAutoCompleteModule,
    AgentsSearchModule
  ],
  declarations: [GreenCardsObligateComponent],
  entryComponents: [AgentsSearchComponent]
})
export class GreenCardsObligateModule {}
