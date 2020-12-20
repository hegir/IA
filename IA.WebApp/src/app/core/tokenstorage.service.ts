import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/Rx';
import { StorageService } from './storage.service';
import { JwtHelper } from './jwthelper';

@Injectable()
export class TokenStorage {

  constructor( private storageService: StorageService) {
}
  public getAccessToken(): string {
    const token: string = <string>sessionStorage.getItem('accessToken');
    return token;
  }

  public getRefreshToken(): Observable<string> {
    const token: string = <string>sessionStorage.getItem('refreshToken');
    return of(token);
  }

  public getRefreshTime(): Observable<number> {
    const refreshTime: number = Number(this.storageService.getItem('refreshTime'));
    return of(refreshTime);
  }

  public getUsername(): Observable<string> {
    const userName: string = <string>this.storageService.getItem('username');
    return of(userName);
  }

  public getLangId(): Observable<string> {
    const langId: string = <string>this.storageService.getItem('langId');
    return of(langId);
  }

  public getPreviousLangId(): string {
    const langId: string = <string>this.storageService.getItem('previousLangId');
    return langId;
  }

  public getUserId(): string {
    return <string>this.storageService.getItem('userId');
  }

  public getRoleId(): string {
    return <string>this.storageService.getItem('roleId');
  }

  public getTenantId(): string | null {
    return sessionStorage.getItem('tenantId');
  }

  public getTenant(): any {
    return JSON.parse(sessionStorage.getItem('tenant'));
  }

  public UpdateTenant(tenant: any): any {
    sessionStorage.removeItem('tenant');
    sessionStorage.setItem('tenant',JSON.stringify(tenant));
  }

  public getUserPermissions(): string[] {
    var permissions: string = <string>sessionStorage.getItem('permissions');
    if (permissions != null) {
      try {
        return JSON.parse(permissions);
      }
      catch (Error) {
        console.log(Error.message);
      }
    }
    return null;
  }

  public getFullName(): string {
    return <string>this.storageService.getItem('fullName');
  }
  public getTenants(): any {
    let tenants = sessionStorage.getItem('tenants');
    if (tenants != null && tenants != 'undefined')
      return JSON.parse(sessionStorage.getItem('tenants'));
    return null;
  }
  public isSuperAdmin(): boolean {
    return <boolean><unknown>this.storageService.getItem('isSuperAdmin');
  }

  public hasManyTenants() {
    if (this.getTenants().length > 1)
      return true;
    return false;
  }
  public setFullName(fullName: string): TokenStorage {
    this.storageService.setItem('fullName', fullName);
    return this;
  }

  public setUserPermissions(permissions: string[]): TokenStorage {
    sessionStorage.setItem('permissions', JSON.stringify(permissions));
    return this;
  }

  public setAccessToken(token: string): TokenStorage {
    sessionStorage.setItem('accessToken', token);
    return this;
  }

  public setRefreshToken(token: string): TokenStorage {
    sessionStorage.setItem('refreshToken', token);
    return this;
  }

  public setRefreshTime(refreshTime: number): TokenStorage {
    this.storageService.setItem('refreshTime', refreshTime.toString());
    return this;
  }

  public setUsername(userName: string): TokenStorage {
    this.storageService.setItem('username', userName);
    return this;
  }

  public setLangId(langId: string): TokenStorage {
    this.storageService.setItem('langId', langId)
    return this;
  }

  public setPreviousLangId(langId: string): TokenStorage {
    this.storageService.setItem('previousLangId', langId)
    return this;
  }

  public setUserId(userId: string): TokenStorage {
    this.storageService.setItem('userId', userId);
    return this;
  }
  public setRoleId(roleId: string): TokenStorage {
    this.storageService.setItem('roleId', roleId);
    return this;
  }
  public setTenantId(tenantId: string): TokenStorage {
    sessionStorage.setItem('tenantId', tenantId);
    return this;
  }
  public setIsSuperAdmin(isSuperAdmin: string): TokenStorage {
    this.storageService.setItem('isSuperAdmin', isSuperAdmin);
    return this;
  }

  public clear() {
    sessionStorage.clear();
  }
  public permissionCheckIfExist(permission: string)
  {
    return JSON.parse(<string>sessionStorage.getItem('permissions')).find(x=>x == permission) == null;
  }
}
