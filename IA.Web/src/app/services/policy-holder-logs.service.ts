import { Injectable } from '@angular/core';
import { BaseCrudService } from "../core/basecrud.service";
import { TranslateService } from "@ngx-translate/core";
import { RequestService } from "../core/request.service";
import { TokenStorage } from '../core/tokenstorage.service';
import { PolicyHolderLog } from '../models/policyHolderLog';


@Injectable({
  providedIn: 'root'
})

export class PolicyHolderLogService extends BaseCrudService<PolicyHolderLog>{
  constructor(protected translateService:TranslateService,protected requestService:RequestService,protected tokenStorage:TokenStorage) {
    super("policyholderlogs/",translateService,requestService,tokenStorage);
  }
  public PostWithReturningId(entity:PolicyHolderLog):Promise<number>{
    return this.requestService.post(this.controller.concat('returningid'),entity)
    .toPromise()
    .then( res => {return <number> res;})
  }
}
