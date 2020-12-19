import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContextMenuModule } from 'primeng/primeng'
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { DemoMaterialModule } from '../../demo-material-module';
import { GreenCardComponent } from './green-card.component';
import { RouterModule } from '@angular/router';
import { GreenCardsRoutes } from './green-card.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { DeleteConfirmationDirectiveModule } from '../../directives/delete.confirmation.module';
import { ArniAutoCompleteModule } from '../../autocomplete/autocomplete.module';
import { GreenCardDetailsComponent } from './green-card-details/green-card-details.component';



@NgModule({
  declarations: [GreenCardComponent, GreenCardDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ContextMenuModule,
    DemoMaterialModule,
    MatButtonModule,
    RouterModule.forChild(GreenCardsRoutes),
    NgxDatatableModule,
    TableModule,
    DeleteConfirmationDirectiveModule,
    ArniAutoCompleteModule,
    FlexLayoutModule,

  ],
  exports:[ GreenCardComponent ]
})
export class GreenCardModule { }
