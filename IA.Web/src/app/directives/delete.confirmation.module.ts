import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteConfirmationDirective } from './delete.confirmation.directive';



@NgModule({
  declarations: [DeleteConfirmationDirective],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
    ],
    exports:[
        DeleteConfirmationDirective
    ]
})
export class DeleteConfirmationDirectiveModule { }
