import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PagesRoutes } from './pages.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LoginComponent } from './login/login.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationModule } from '../core/authentication.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    DemoMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    TranslateModule,
  ],
  declarations: [
  LoginComponent]
})
export class PagesModule {}
