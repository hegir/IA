import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../../../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import {CompaniesComponent} from './../companies/companies.component'
import { CompaniesRoutes } from './companies.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {TableModule} from 'primeng/table';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompaniesDetailsComponent } from './companies-details/companies-details.component';
import { ArniAutoCompleteModule } from '../../../autocomplete/autocomplete.module';




@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    RouterModule.forChild(CompaniesRoutes),
    NgxDatatableModule,
    TableModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ArniAutoCompleteModule
  ],
  declarations: [CompaniesComponent, CompaniesDetailsComponent]
})
export class CompaniesModule {}
