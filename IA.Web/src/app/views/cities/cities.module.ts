import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import {CitiesComponent} from '../cities/cities.component'
import { CitiesRoutes } from './cities.routing';
import { TableModule } from 'primeng/table';
import { CitiesDetailsComponent } from '../cities/cities-details/cities-details.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DeleteConfirmationDirectiveModule } from '../../directives/delete.confirmation.module';
import { ArniAutoCompleteModule } from '../../autocomplete/autocomplete.module';



@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    RouterModule.forChild(CitiesRoutes),
    TableModule,
    SharedModule,
    FormsModule,
    DeleteConfirmationDirectiveModule,
    ArniAutoCompleteModule

  ],
  declarations: [CitiesComponent, CitiesDetailsComponent]
})
export class CitiesModule {}
