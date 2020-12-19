import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import {PolicyHoldersComponent} from './policy-holders.component'
import { PolicyHoldersRoutes } from './policy-holders.routing';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule} from '@angular/forms';
import { PolicyHolderDetailsComponent } from './policy-holder-details/policy-holder-details.component';
import { DeleteConfirmationDirectiveModule } from '../../directives/delete.confirmation.module';
import { ArniAutoCompleteModule } from './../../autocomplete/autocomplete.module';




@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    RouterModule.forChild(PolicyHoldersRoutes),
    TableModule,
    SharedModule,
    FormsModule,
    DeleteConfirmationDirectiveModule,
    ArniAutoCompleteModule
  ],
  declarations: [PolicyHoldersComponent, PolicyHolderDetailsComponent]
})
export class PolicyHoldersModule {}
