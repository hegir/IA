import { Injectable } from '@angular/core';
import { BaseCrudService } from "../core/basecrud.service";
import { TranslateService } from "@ngx-translate/core";
import { RequestService } from "../core/request.service";
import { TokenStorage } from '../core/tokenstorage.service';
import { PolicyLog } from '../models/policyLog';
import { PolicyLogDataDto } from '../dtos/policyLogDataDto';


@Injectable({
  providedIn: 'root'
})

export class PolicyLogService extends BaseCrudService<PolicyLog>{
  constructor(protected translateService:TranslateService,protected requestService:RequestService,protected tokenStorage:TokenStorage) {
    super("policylogs/",translateService,requestService,tokenStorage);
  }
  public FindAllPolicyLogs(policyId:number):Promise<PolicyLog[]>{
    return this.requestService.get(this.controller.concat(policyId+'/logs'))
    .toPromise()
    .then(res => { return <PolicyLog[]>res });
  }
}
