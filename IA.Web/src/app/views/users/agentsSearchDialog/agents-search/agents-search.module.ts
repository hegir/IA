import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContextMenuModule, SharedModule } from 'primeng/primeng'
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FlexLayoutModule } from "@angular/flex-layout";
import { AgentsSearchComponent } from './agents-search.component';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { DemoMaterialModule } from '../../../../demo-material-module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [ AgentsSearchComponent ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ContextMenuModule,
    FlexLayoutModule,
    TableModule,
    TranslateModule,
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    FormsModule,
    NgxDatatableModule,
    TableModule,
    SharedModule,
    ContextMenuModule,
  ],
  exports:[ AgentsSearchComponent ]
})
export class AgentsSearchModule { }
