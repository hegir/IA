import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { AuthService } from 'ngx-auth';
import { TokenStorage } from './tokenstorage.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';
import { SpinnerService } from './spinner.service'
import { NotificationsService } from './notifications.service'
import { JwtHelper } from './jwthelper';
import { registerLocaleData } from '@angular/common';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

interface AccessToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  hs_expires_in: number;
}

@Injectable()
export class AuthenticationService implements AuthService {

  private _reqSpinnerSub: Subscription;
  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router,
    private spinnerService: SpinnerService,
    private notificationService: NotificationsService,
  ) {
  }

  public isAuthorized(): Observable<boolean> {
    let token = this.tokenStorage.getAccessToken();
    return of(token != null);
  }

  public getAccessToken(): Observable<string> {
    return of(this.tokenStorage.getAccessToken());
  }

  public refreshToken(): Observable<AccessToken> {
    if (document.hidden) {
      this.logout();
      return Observable.empty();
    }
    this.spinnerService.showSpinner();
    return this.tokenStorage
      .getRefreshToken()
      .switchMap((refresh_token: string) => {
        if (refresh_token == null) {
          this.logout();
          return Observable.empty();
        }
        var refreshToken: any = {};
        refreshToken.GrantType = "refresh_token";
        refreshToken.RefreshToken = refresh_token;
        let tenantId = this.tokenStorage.getTenantId();
        if (tenantId != null && tenantId != "undefined")
          refreshToken.TenantId = this.tokenStorage.getTenantId();
        return <Observable<AccessToken>>this.http.post(`${environment.apiEndpoint}tokens`, refreshToken);
      }).do((token) => {
        this.spinnerService.removeSpinner();
        this.saveAccessData(token);
      })
      .catch((err) => {
        this.spinnerService.removeSpinner();
        this.logout();
        return Observable.empty();
      });
  }

  public forceRefreshToken(): void {
    if (this.isAuthorized())
      this.refreshToken().toPromise()
        .then(() => this.setTimedRefreshToken());
  }

  setTimedRefreshToken(): void {
    this.tokenStorage.getRefreshTime().toPromise()
      .then((refreshTime: number) => {
        var time: number = ((refreshTime * 97) / 100) * 1000;
        this._reqSpinnerSub = Observable.timer(time, time)
          .subscribe(() => {
            this._reqSpinnerSub.unsubscribe();
            this.refreshToken().toPromise().then();
          });
      });
  }

  public refreshShouldHappen(response: HttpErrorResponse): boolean {
    return false;
  }

  public verifyTokenRequest(url: string): boolean {
    let verify = url.endsWith('/tokens');
    return verify;
  }

  public login(username: string, password: string, authCode: number = null, publicToken: string = null): Promise<any> {
    this.spinnerService.showSpinner();
    var authData: any = {}
    authData.GrantType = "password";
    authData.Username = username;
    authData.Password = password;
    if (authCode != null) {
      authData.AuthCode = authCode;
      authData.GrantType = "auth_code";
      authData.PublicToken = publicToken;
    }

    return this.http.post(`${environment.apiEndpoint}tokens`, authData)
      .toPromise()
      .then((tokens: any) => {
        if (Object.keys(tokens).length == 4) {
          this.saveAccessData(<AccessToken>tokens);
        }
        else {
          return tokens;
        }
      })
      .then(data => { this.spinnerService.removeSpinner(); return data; })
      .catch(err => {
        console.log(err);
        this.logout();
        this.spinnerService.removeSpinner();
        this.notificationService.danger(err.error);
      });
  }

  public changeTenant(tenantId: number, refreshToken: string): Promise<any> {
    this.spinnerService.showSpinner();
    var authData: any = {}
    authData.GrantType = "refresh_token"
    authData.TenantId = tenantId;
    authData.RefreshToken = refreshToken;

    return this.http.post(`${environment.apiEndpoint}tokens`, authData)
      .toPromise()
      .then((tokens: AccessToken) => this.saveAccessData(tokens))
      .then(data => { this.spinnerService.removeSpinner(); return data; })
      .catch(err => {
        this.spinnerService.removeSpinner();
      });
  }

  public loginWithRefreshToken(refreshTOken: string): Promise<any> {
    this.spinnerService.showSpinner();
    var refreshToken: any = {};
    refreshToken.GrantType = "refresh_token";
    refreshToken.RefreshToken = refreshTOken;

    return this.http.post(`${environment.apiEndpoint}tokens`, refreshToken)
      .toPromise()
      .then((tokens: AccessToken) => this.saveAccessData(tokens))
      .then(data => { this.spinnerService.removeSpinner(); return data; })
      .catch(err => {
        //this.notificationService.error("ERROR", "WRONG_TOKEN");
        this.spinnerService.removeSpinner();
      });
  }

  public logout(): void {
    swal.close();
    this.tokenStorage.clear();
    this.router.navigate(['/pages/login/'])
  }

  private saveAccessData({ access_token, refresh_token, expires_in }: AccessToken) {
    this.tokenStorage
      .setAccessToken(access_token)
      .setRefreshToken(refresh_token)
      .setRefreshTime(expires_in);
    this.setTimedRefreshToken();
    let jwtHelper = new JwtHelper();
    let data = jwtHelper.decodeToken(access_token);
    this.tokenStorage.setUsername(data.username);
    this.tokenStorage.setUserId(data.user_id);
    this.tokenStorage.setFullName(data.full_name);
    this.tokenStorage.setTenantId(data.tenant_id);
    this.tokenStorage.setIsSuperAdmin(data.is_super_admin);
    this.tokenStorage.setLangId(data.lang_id);

    let roleKey = ''
    Object.keys(data).forEach(key => {
      if (key.endsWith('claims/role'))
        roleKey = key;
    });

    this.tokenStorage.setRoleId(data[roleKey]);
  }

  public getFullName(): string {
    return this.tokenStorage.getFullName();
  }

  public getUserId(): string {
    return this.tokenStorage.getUserId();
  }

}
