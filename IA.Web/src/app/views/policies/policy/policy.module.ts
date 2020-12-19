import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {TableModule} from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../../../demo-material-module';
import { SharedModule } from '../../../shared/shared.module';
import { DeleteConfirmationDirectiveModule } from '../../../directives/delete.confirmation.module';
import { PolicyComponent } from './policy.component';
import { PolicyDetailsComponent } from './policy-details/policy-details.component';
import { PolicyRoutes } from './policy.routing';
import { ArniAutoCompleteModule } from '../../../autocomplete/autocomplete.module';
import { MatSelectModule, MatAutocomplete, MatButtonModule, MatTooltipModule, MatStepperModule } from '@angular/material';
import { DynamicDialogModule } from 'primeng/components/dynamicdialog/dynamicdialog';
import { NgxMaskModule } from 'ngx-mask';
import { PolicyNumberStornComponent } from '../../policyNumbers/policy-number-storn/policy-number-storn.component';
import { PolicyNumberStornModule } from '../../policyNumbers/policy-number-storn/policy-number-storn.module';
import { PolicyPaymentsComponent } from './policy-payments/policy-payments.component';
import { NewColorComponent } from '../../new-color/new-color.component';
import { NewColorModule } from '../../new-color/new-color.module';
import { VehicleTypeModelModule } from '../../vehicle-type-model/vehicle-type-model.module';
import { VehicleTypeModelComponent } from '../../vehicle-type-model/vehicle-type-model.component';



@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    FormsModule,
    RouterModule.forChild(PolicyRoutes),
    NgxDatatableModule,
    ArniAutoCompleteModule,
    TableModule,
    SharedModule,
    DeleteConfirmationDirectiveModule,
    MatSelectModule,
    ReactiveFormsModule,
    VehicleTypeModelModule,
    DynamicDialogModule,
    MatStepperModule,
    MatTooltipModule,
    NgxMaskModule.forRoot(),
    PolicyNumberStornModule,
    NewColorModule
  ],
  declarations: [PolicyComponent,PolicyDetailsComponent, PolicyPaymentsComponent],
  entryComponents:[VehicleTypeModelComponent,PolicyNumberStornComponent,NewColorComponent]

})
export class PoliciesModule {}
