import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { MatSelectModule, MatAutocomplete } from '@angular/material';
import { DemoMaterialModule } from '../../../../demo-material-module';
import { ArniAutoCompleteModule } from '../../../../autocomplete/autocomplete.module';
import { PremiumComponent } from './premium.component';
import { PremiumReportRoutes } from './premium.routing';




@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(PremiumReportRoutes),
        FormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        TableModule,
        SharedModule,
        ReactiveFormsModule,
        MatSelectModule,
        NgxDatatableModule,
        ArniAutoCompleteModule
    ],
    declarations: [PremiumComponent]
})

export class PremiumReportModule {}
