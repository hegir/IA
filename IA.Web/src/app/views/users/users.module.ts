import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import {UsersComponent} from './users.component'
import { UsersRoutes } from './users.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {TableModule} from 'primeng/table';
import { UsersDetailsComponent } from './users-details/users-details.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArniAutoCompleteModule } from '../../autocomplete/autocomplete.module';
import { DeleteConfirmationDirectiveModule } from '../../directives/delete.confirmation.module';
import { UserChangePasswordComponent } from './changePassword/user-change-password/user-change-password.component';
import { ContextMenuModule } from 'primeng/primeng';
import { DynamicDialogModule } from 'primeng/components/dynamicdialog/dynamicdialog';
import { MatButtonModule } from '@angular/material';
import { UsersChangePasswordModule } from './changePassword/user-change-password/user-change-password.module';





@NgModule({
  declarations: [UsersComponent, UsersDetailsComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    RouterModule.forChild(UsersRoutes),
    NgxDatatableModule,
    TableModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DeleteConfirmationDirectiveModule,
    ArniAutoCompleteModule,
    ContextMenuModule,
    DynamicDialogModule,
    FlexLayoutModule,
    MatButtonModule,
    UsersChangePasswordModule
  ],

  entryComponents:[UserChangePasswordComponent]
})
export class UsersModule {}
