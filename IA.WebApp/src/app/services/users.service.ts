import { Injectable } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { BaseCrudService } from "../core/basecrud.service";
import { RequestService } from "../core/request.service";
import { User } from "../models/user";
import { TokenStorage } from "../core/tokenstorage.service";
import { Observable } from "rxjs";

@Injectable()
export class UsersService extends BaseCrudService<User>{
  constructor(protected translateService: TranslateService, protected requestService: RequestService, protected tokenStorage: TokenStorage) {
    super("users/", translateService, requestService, tokenStorage);
  }
  
  public async GetPermissions(): Promise<string[]> {
    var permissions = this.tokenStorage.getUserPermissions();
    if (permissions != null) {
      return Observable.of(permissions).toPromise();
    }
    return this.requestService.get(this.controller.concat("permissions"), false)
      .toPromise()
      .then(res => <string[]>res)
      .then(data => { this.tokenStorage.setUserPermissions(data); return data; })
  }

  public async LogOut(): Promise<any>
  {
      return this.requestService.post(this.controller.concat("logout"), null)
      .toPromise()
      .then(res =>{return res});
  }

}
