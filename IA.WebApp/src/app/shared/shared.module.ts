import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { DateFormatPipe } from './pipes/dateformat.pipe';
import { DateTimeFormatPipe } from './pipes/datetimeformat.pipe';
import { FormatCurrencyPipe } from './pipes/formatcurrency.pipe';
import { FormatNumberPipe } from './pipes/formatnumber.pipe';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AuthenticationModule } from '../core/authentication.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
    exports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        DateFormatPipe,
        DateTimeFormatPipe,
        FormatCurrencyPipe,
        NgxPermissionsModule,
        FormatNumberPipe,
        AuthenticationModule,
    ],
    declarations: [
        DateFormatPipe,
        DateTimeFormatPipe,
        FormatCurrencyPipe,
        FormatNumberPipe,

    ],
    imports: [
        AngularMultiSelectModule
    ]
})
export class SharedModule { }