import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContextMenuModule } from 'primeng/primeng'
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { DemoMaterialModule } from '../../demo-material-module';
import { VehicleTypeModelComponent } from './vehicle-type-model.component';


@NgModule({
  declarations: [VehicleTypeModelComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ContextMenuModule,
    FlexLayoutModule,
    DemoMaterialModule,
    MatButtonModule
  ],
  exports:[ VehicleTypeModelComponent ]
})
export class VehicleTypeModelModule { }
