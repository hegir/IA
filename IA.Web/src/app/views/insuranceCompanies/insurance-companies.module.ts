import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { InsuranceCompanyRoutes } from './insurance-companies.routing';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule} from '@angular/forms';
import { InsuranceCompanyComponent } from './insurance-companies.component';
import { DeleteConfirmationDirectiveModule } from '../../directives/delete.confirmation.module';
import { InsuranceCompanyDetailsComponent } from './insurance-company-details/insurance-company-details.component';
import { InsuranceCompanyMainOfficeDetailsComponent } from './insurance-company-main-office-details/insurance-company-main-office-details.component';





@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    RouterModule.forChild(InsuranceCompanyRoutes),
    TableModule,
    SharedModule,
    FormsModule,
    DeleteConfirmationDirectiveModule
  ],
  declarations: [InsuranceCompanyComponent, InsuranceCompanyDetailsComponent, InsuranceCompanyMainOfficeDetailsComponent ]
})
export class InsuranceCompaniesModule {}
