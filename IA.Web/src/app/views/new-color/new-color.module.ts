import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContextMenuModule } from 'primeng/primeng'
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { DemoMaterialModule } from '../../demo-material-module';
import { NewColorComponent } from './new-color.component';


@NgModule({
  declarations: [NewColorComponent],
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
  exports:[ NewColorComponent ]
})
export class NewColorModule { }
