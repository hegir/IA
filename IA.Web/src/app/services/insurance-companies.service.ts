import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseCrudService } from "../core/basecrud.service";
import { RequestService } from "../core/request.service";
import { Insurance } from '../models/insuranceCompany';
import { TokenStorage } from '../core/tokenstorage.service';
import { PolicyNumber } from '../models/policyNumber';
import { ContractedComission } from '../models/contractedComission';

@Injectable()
export class InsuranceCompanyService extends BaseCrudService<Insurance> {
    constructor(protected translateService: TranslateService, protected requestService: RequestService, protected tokenStorage : TokenStorage) {
        super("insurances/", translateService, requestService,tokenStorage);
    }
    public FindAllActive():Promise<Insurance[]>{
     return this.requestService.get(this.controller.concat("active")).toPromise()
      .then(res=> { return <Insurance[]> res;})
    }
    public FindAllActivePolicyNumbers(insuranceId:number):Promise<PolicyNumber[]>{
      return this.requestService.get(this.controller.concat(insuranceId+"/activepolicynumbers")).toPromise()
       .then(res=> { return <PolicyNumber[]> res;})
     }
     public FindAllInsurancesWithActivePolicyNumbers():Promise<Insurance[]>{
      return this.requestService.get(this.controller.concat("insurances")).toPromise()
       .then(res=> { return <Insurance[]> res;})
     }
     public FindAllContractedComissions(insuranceId : string):Promise<ContractedComission[]>{
       return this.requestService.get(this.controller.concat(`${insuranceId}/insurancetypes`)).toPromise()
       .then(res=>{return <ContractedComission[]> res;})
     }
}
