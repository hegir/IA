import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArniAutoCompleteComponent } from './autocomplete.component';
import { SharedModule } from '../shared/shared.module';
import {DemoMaterialModule} from '../demo-material-module'

@NgModule({
  declarations: [ArniAutoCompleteComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule
    ],
    exports:[
      ArniAutoCompleteComponent
    ]
})
export class ArniAutoCompleteModule { }
