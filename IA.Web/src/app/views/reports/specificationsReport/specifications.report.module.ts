import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { SpecificationsReportComponent } from './specifications.report.component';
import { SpecificationsReportRoutes } from './specifications.report.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { MatSelectModule, MatAutocomplete } from '@angular/material';
import { DemoMaterialModule } from '../../../demo-material-module';
import { ArniAutoCompleteModule } from '../../../autocomplete/autocomplete.module';




@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(SpecificationsReportRoutes),
        FormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        TableModule,
        SharedModule,
        ReactiveFormsModule,
        MatSelectModule,
        NgxDatatableModule,
        ArniAutoCompleteModule,
    ],
    declarations: [SpecificationsReportComponent]
})

export class SpecificationsReportModule {}
