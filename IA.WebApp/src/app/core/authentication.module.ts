import { NgModule } from '@angular/core';
import {
  AuthModule,
  AUTH_SERVICE,
  PUBLIC_FALLBACK_PAGE_URI,
  PROTECTED_FALLBACK_PAGE_URI
 } from 'ngx-auth';

import { TokenStorage } from './tokenstorage.service';
import { AuthenticationService } from './authentication.service';
import { SpinnerService } from './spinner.service'
export function factory(authenticationService: AuthenticationService) {
  return authenticationService;
}

@NgModule({
    imports: [ AuthModule ],
    providers: [
      TokenStorage,
      AuthenticationService,
      { provide: PROTECTED_FALLBACK_PAGE_URI, useValue: '/' },
      { provide: PUBLIC_FALLBACK_PAGE_URI, useValue: '/pages/login' },
      {
        provide: AUTH_SERVICE,
        deps: [ AuthenticationService ],
        useFactory: factory
      }
    ]
})
export class AuthenticationModule {

}
