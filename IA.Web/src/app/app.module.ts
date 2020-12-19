import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AuthenticationModule } from './core/authentication.module';
import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { RequestService } from './core/request.service';
import { SpinnerService } from './core/spinner.service';
import { NotificationsService } from './core/notifications.service';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { HttpModule } from '@angular/http';
import { TokenStorage } from './core/tokenstorage.service';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { DynamicDialogModule } from 'primeng/components/dynamicdialog/dynamicdialog';
import {CustomReuseStrategy} from './core/customreuseroute';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { environment } from '../environments/environment';
import { registerLocaleData } from '@angular/common';
import localeBs from '@angular/common/locales/bs';

registerLocaleData(localeBs, 'bs');


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    AppBlankComponent,
    AppSidebarComponent,
    AuthLayoutComponent
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    DynamicDialogModule,
    PerfectScrollbarModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forRoot(AppRoutes),
    TranslateModule.forRoot(),
    AuthenticationModule,
    HttpModule,
    NgxPermissionsModule.forRoot(),
  ],
  providers: [
    RequestService,
    SpinnerService,
    NotificationsService,
    {
      provide: APP_INITIALIZER,
      useFactory: (ds: TokenStorage,ps: NgxPermissionsService) => function(){
        let permissions = ds.getUserPermissions();
        if(permissions){
          ps.loadPermissions(ds.getUserPermissions());
        }
      },
      deps: [TokenStorage,NgxPermissionsService],
      multi: true
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    { provide: MAT_DATE_LOCALE, useValue: environment.datePickerLocale },
    { provide: LOCALE_ID, useValue: environment.defaultLanguage }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
