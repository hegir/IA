import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintTechnologicalProcessComponent } from './printTechnologicalProcess/printTechnologicalProcess.component';
import { SharedModule } from '../../shared/shared.module';
import {PrintSpecificationComponent} from './printSpecifiactionPdf'
import { PrintReturnedPolicyNumbersComponent } from './printReturnedPolicyNumbersPdf';


@NgModule({
  imports: [
      CommonModule,
      SharedModule,
  ],
  declarations: [PrintTechnologicalProcessComponent,PrintSpecificationComponent,PrintReturnedPolicyNumbersComponent],
  exports:[PrintTechnologicalProcessComponent,PrintSpecificationComponent,PrintReturnedPolicyNumbersComponent]
})

export class PrintPdfModule {}
