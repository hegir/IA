import { NgModule } from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {
  AccordionAnchorDirective,
  AccordionLinkDirective,
  AccordionDirective
} from './accordion';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { DateFormatPipe } from './pipes/dateformat.pipe';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DateTimeFormatPipe } from './pipes/dateTimeFormat.pipe';



@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    DateFormatPipe,
    DateTimeFormatPipe
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    TranslateModule,
    HttpClientModule,
    HttpModule,
    DateFormatPipe,
    NgxPermissionsModule,
    DateTimeFormatPipe
  ],
  providers: []
})
export class SharedModule {}
