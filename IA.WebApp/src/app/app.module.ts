import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ComponentsModule } from "./components/components.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";

import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";

import { AppRoutes } from "./app.routing";
import { ngxLoadingAnimationTypes, NgxLoadingModule } from "ngx-loading";
import { AuthenticationModule } from "./core/authentication.module";
import { NgxPermissionsModule, NgxPermissionsService } from "ngx-permissions";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FormsModule } from "@angular/forms";
import { TokenStorage } from "./core/tokenstorage.service";
import { NotificationsService } from "./core/notifications.service";
import { SpinnerService } from "./core/spinner.service";
import { StorageService } from "./core/storage.service";
import { registerLocaleData } from '@angular/common';
import localeBs from '@angular/common/locales/bs';
registerLocaleData(localeBs, 'bs');

@NgModule({
  declarations: [AppComponent, AdminLayoutComponent, AuthLayoutComponent],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: true
    }),
    NgbModule,
    ToastrModule.forRoot(), // ToastrModule added
    ComponentsModule,
    NgxLoadingModule.forRoot({ animationType: ngxLoadingAnimationTypes.chasingDots, fullScreenBackdrop: true }),
    AuthenticationModule,
    NgxPermissionsModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
  ],
  providers: [
    TokenStorage,
    NotificationsService,
    SpinnerService,
    {
      provide: APP_INITIALIZER,
      useFactory: (ds: TokenStorage, ps: NgxPermissionsService) => function () {
        let permissions = ds.getUserPermissions();
        if (permissions) {
          ps.loadPermissions(ds.getUserPermissions());
        }
      },
      deps: [TokenStorage, NgxPermissionsService],
      multi: true,
    },
    StorageService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
