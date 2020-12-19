import { Injectable } from "@angular/core";
import { strictEqual } from "assert";
import { Observable, of } from "rxjs";

@Injectable()
export class TokenStorage {
    public getAccessToken(): string {
        const token: string = <string>localStorage.getItem('accessToken');
        return token;
    }
    public getRefreshToken(): Observable<string> {
        const token: string = <string>localStorage.getItem('refreshToken');
        return of(token);
    }
    public getRefreshTime(): Observable<number> {
        const refreshTime: number = Number(localStorage.getItem('refreshTime'));
        return of(refreshTime);
    }
    public getUsername(): string {
        return <string>localStorage.getItem('username');
    }
    public getUserId(): string {
        return <string>localStorage.getItem('userId');
    }
    public getUserPermissions(): string[] {
        var permissions: string = <string>localStorage.getItem('permissions');
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
        return <string>localStorage.getItem('fullName');
    }
    public getRoleId(): string {
        return <string>localStorage.getItem("roleId");
    }
    public setFullName(fullName: string): TokenStorage {
        localStorage.setItem('fullName', fullName);
        return this;
    }
    public setUserPermissions(permissions: string[]): TokenStorage {
        localStorage.setItem('permissions', JSON.stringify(permissions));
        return this;
    }
    public setAccessToken(token: string): TokenStorage {
        localStorage.setItem('accessToken', token);
        return this;
    }
    public setRefreshToken(token: string): TokenStorage {
        localStorage.setItem('refreshToken', token);
        return this;
    }
    public setRefreshTime(refreshTime: number): TokenStorage {
        localStorage.setItem('refreshTime', refreshTime.toString());
        return this;
    }
    public setUsername(username: string): TokenStorage {
        localStorage.setItem('username', username);
        return this;
    }
    public setUserId(userId: string): TokenStorage {
        localStorage.setItem('userId', userId);
        return this;
    }
    public setRoleId(roleId: string): TokenStorage {
        localStorage.setItem('roleId', roleId);
        return this;
    }
    public clear() {
        localStorage.clear();
    }
    public setCompanyId(companyId : string):TokenStorage{
      localStorage.setItem('company_id',companyId);
      return this;
    }

    public getCompanyId():any{
      return JSON.parse(localStorage.getItem('company_id'));
    }
}
