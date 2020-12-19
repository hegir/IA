import { Injectable } from '@angular/core';
import { RequestService } from "../core/request.service";
import { CompanyInsuranceMainOffice } from '../models/companyInsuranceMainOffice';
import { CompanyInsurance } from '../models/companyInsurance';

@Injectable()
export class CompaniesInsurancesService  {
  controller : string = "companies/"
    constructor(protected requestService: RequestService) {
    }
 public PostCompanyInsurance(companyId : string,companyInsurance : CompanyInsurance):Promise<CompanyInsurance>
 {
   return this.requestService.post(this.controller.concat(companyId + "/insurances"),companyInsurance).toPromise()
   .then(res=>{return <CompanyInsurance> res;})
 }
 public UpdateCompanyInsurance(companyId : string,companyInsurance : CompanyInsurance) : Promise<CompanyInsurance>
 {
   return this.requestService.put(this.controller.concat(companyId + "/insurances"),companyInsurance).toPromise()
   .then(res=> { return <CompanyInsurance> res;})
 }
 public FindAllCompanies(companyId : string):Promise<CompanyInsurance[]>{
   return this.requestService.get(this.controller.concat(companyId + "/insurances")).toPromise()
   .then(res=>{return <CompanyInsurance[]>res;})
 }
}
