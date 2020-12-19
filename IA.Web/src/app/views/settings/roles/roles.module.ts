import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../../../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { RolesRoutes } from './roles.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../../shared/shared.module';
import { RolesComponent } from './roles.component';
import {TableModule} from 'primeng/table';
import { RolesDetailsComponent } from './roles-details/roles-details.component';
import { FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    RouterModule.forChild(RolesRoutes),
    NgxDatatableModule,
    TableModule,
    SharedModule,
    FormsModule,
  ],
  declarations: [RolesComponent, RolesDetailsComponent]
})
export class RolesModule {}
