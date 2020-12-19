import { AuthModule, PROTECTED_FALLBACK_PAGE_URI, PUBLIC_FALLBACK_PAGE_URI, AUTH_SERVICE } from "ngx-auth";
import { TokenStorage } from "./tokenstorage.service";
import { SpinnerService } from "./spinner.service";
import { AuthenticationService } from "./authentication.service";
import { NgModule } from '@angular/core';

export function factory(authenticationService : AuthenticationService){
    return authenticationService;
}

@NgModule({
    imports: [AuthModule],
    providers: [
        TokenStorage,
        SpinnerService,
        AuthenticationService,
        { provide: PROTECTED_FALLBACK_PAGE_URI,useValue: '/'},
        { provide: PUBLIC_FALLBACK_PAGE_URI, useValue: '/pages/login'},
        {
            provide: AUTH_SERVICE,
            deps : [AuthenticationService],
            useFactory : factory
        }
    ]
})
export class AuthenticationModule{
}