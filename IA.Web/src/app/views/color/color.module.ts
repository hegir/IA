import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule} from '@angular/forms';
import { DeleteConfirmationDirectiveModule } from '../../directives/delete.confirmation.module';
import { ColorsRoutes } from './color.routing';
import { ColorComponent } from './color.component';
import { ColorDetailsComponent } from './color-details/color-details.component';






@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    RouterModule.forChild(ColorsRoutes),
    TableModule,
    SharedModule,
    FormsModule,
    DeleteConfirmationDirectiveModule
  ],
  declarations: [ColorComponent, ColorDetailsComponent]
})
export class ColorsModule {}
