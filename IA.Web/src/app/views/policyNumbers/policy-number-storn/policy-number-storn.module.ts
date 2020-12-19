import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContextMenuModule } from 'primeng/primeng'
import { PolicyNumberStornComponent } from './policy-number-storn.component';
import { DemoMaterialModule } from '../../../demo-material-module';
import { DynamicDialogModule } from 'primeng/components/dynamicdialog/dynamicdialog';
import { ArniAutoCompleteModule } from '../../../autocomplete/autocomplete.module';

@NgModule({
  declarations: [PolicyNumberStornComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ContextMenuModule,
    DynamicDialogModule,
    CommonModule,
    DemoMaterialModule,
    ArniAutoCompleteModule,
    ],
    exports:[
      PolicyNumberStornComponent
    ],
    providers : [DynamicDialogModule]
})
export class PolicyNumberStornModule { }
