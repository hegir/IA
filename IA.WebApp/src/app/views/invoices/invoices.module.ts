import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { TableModule} from 'primeng/table';

import { InvoicesRoutes } from "./invoices.routing";
import { InvoicesComponent } from "./invoices.component";
import { SharedModule } from "src/app/shared/shared.module";
import {DropdownModule} from 'primeng/dropdown';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(InvoicesRoutes),
    TableModule,
    DropdownModule,
    SharedModule
  ],
  declarations: [
    InvoicesComponent
  ]
})
export class InvoicesModule {}
