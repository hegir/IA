import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContextMenuModule } from 'primeng/primeng'
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedModule } from '../../../../shared/shared.module';
import { MatButtonModule } from '@angular/material';
import { UserChangePasswordComponent } from './user-change-password.component';
import { DemoMaterialModule } from '../../../../demo-material-module';

@NgModule({
  declarations: [UserChangePasswordComponent],
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
  exports:[ UserChangePasswordComponent ]
})
export class UsersChangePasswordModule { }
