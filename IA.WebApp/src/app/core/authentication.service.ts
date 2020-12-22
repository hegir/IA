import { Injectable } from "@angular/core";
import {AuthService} from 'ngx-auth';
import { Subscription, Observable, of } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { TokenStorage } from "./tokenstorage.service";
import { Router } from "@angular/router";
import { SpinnerService } from "./spinner.service";
import { NotificationsService } from "./notifications.service";
import { environment } from "../../environments/environment";
import { JwtHelper } from "./jwthelper";


interface AccessToken{
    Token : string;
    RefreshToken : string;
    ExpiresIn : number;
}
@Injectable()
export class AuthenticationService implements AuthService{
private _reqSpinnerSub : Subscription;
constructor(
    private http : HttpClient,
    private tokenStorage: TokenStorage,
    private router : Router,
    private spinnerService : SpinnerService,
    private notificationService : NotificationsService
){}

public isAuthorized(): Observable<boolean> {
    let token = this.tokenStorage.getAccessToken();
    return of(token != null);
}
public getAccessToken(): Observable<string>{
    return of(this.tokenStorage.getAccessToken());
}
public refreshToken():Observable<AccessToken>{
    this.spinnerService.showSpinner();
    return this.tokenStorage
    .getRefreshToken()
    .switchMap((refresh_token:string) => {
        if(refresh_token == null){
            this.logout();
            return Observable.empty();
        }
        var refreshToken :any = {};
        refreshToken.GrantType="refresh_token";
        refreshToken.RefreshToken = refresh_token;
        return <Observable<AccessToken>>this.http.post(`${environment.apiEndpoint}tokens`,refreshToken);
    }).do((token) =>{
        this.spinnerService.removeSpinner();
        this.saveAccessData(token);
    })
    .catch((err) => {
        this.spinnerService.removeSpinner();
        this.logout();
        return Observable.empty();
    })
}

public forceRefreshToken():void{
    if(this.isAuthorized()){
        this.refreshToken().toPromise()
        .then(() => this.setTimedRefreshToken());
    }
}

logout(){
    this.tokenStorage.clear();
    this.router.navigate(['/pages/login/'])
}


private saveAccessData(token: AccessToken) {
    this.setTimedRefreshToken();
    this.tokenStorage
        .setAccessToken(token.Token)
        .setRefreshToken(token.RefreshToken)
        .setRefreshTime(token.ExpiresIn);
    let jwtHelper = new JwtHelper();
    let data = jwtHelper.decodeToken(token.Token);
    this.tokenStorage.setUsername(data.username);
    this.tokenStorage.setUserId(data.user_id);
    this.tokenStorage.setFullName(data.full_name);
    let roleKey = ''
    Object.keys(data).forEach(key => {
        if(key.endsWith('claims/role'))
            roleKey = key;
    });

    this.tokenStorage.setRoleId(data[roleKey]);
}

setTimedRefreshToken(): void{
    this.tokenStorage.getRefreshTime().toPromise()
    .then((refreshTime : number) =>{
        var time: number=((refreshTime * 90)/ 100) * 1000;
        this._reqSpinnerSub = Observable.timer(time,time)
        .subscribe(() => {
            this._reqSpinnerSub.unsubscribe();
            this.refreshToken().toPromise().then();
        });
    });
}

public refreshShouldHappen(response : HttpErrorResponse): boolean{
    return false;
}

public verifyTokenRequest(url : string): boolean{
    let verify = url.endsWith('/tokens');
    return verify;
}

public login(username : string,password : string): Promise<any>{
    this.spinnerService.showSpinner();
    var authData: any = {};
    authData.GrantType="password";
    authData.Username=username;
    authData.Password=password;
    return this.http.post(`${environment.apiEndpoint}tokens`,authData)
    .toPromise()
    .then((tokens : AccessToken) =>{
        this.saveAccessData(tokens);
    })
    .then( data => {
         this.spinnerService.removeSpinner();
          return data;

        })
    .catch( err =>{
        this.spinnerService.removeSpinner();
          this.notificationService.danger(err.error)
    })
}

public loginWithRefreshToken(refreshTOken : string): Promise<any>{
    this.spinnerService.showSpinner();
    let refreshToken: any={};
    refreshToken.GrantType="refresh_token";
    refreshToken.RefreshToken=refreshTOken;
    return this.http.post(`${environment.apiEndpoint}tokens`,refreshToken)
    .toPromise()
    .then((tokens : AccessToken) => this.saveAccessData(tokens))
    .then(data => { this.spinnerService.removeSpinner();return data;})
    .catch(err =>{
        this.spinnerService.removeSpinner();

    })
}

public getFullName(): string {
  return this.tokenStorage.getFullName();
}
}
