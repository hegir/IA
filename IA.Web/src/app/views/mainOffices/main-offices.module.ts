import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import {MainOfficesComponent} from './main-offices.component'
import { MainOfficesRoutes } from './main-offices.routing';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../../shared/shared.module';
import { MainOfficesDetailsComponent } from './main-offices-details/main-offices-details.component';
import { FormsModule} from '@angular/forms';
import { DeleteConfirmationDirectiveModule } from '../../directives/delete.confirmation.module';




@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    RouterModule.forChild(MainOfficesRoutes),
    TableModule,
    SharedModule,
    FormsModule,
    DeleteConfirmationDirectiveModule
  ],
  declarations: [MainOfficesComponent, MainOfficesDetailsComponent]
})
export class MainOfficesModule {}
