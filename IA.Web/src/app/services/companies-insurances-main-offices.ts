import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseCrudService } from "../core/basecrud.service";
import { RequestService } from "../core/request.service";
import { CompanyInsuranceMainOffice } from '../models/companyInsuranceMainOffice';
import { InsuranceCompanyService } from './insurance-companies.service';

@Injectable()
export class CompaniesInsurancesMainOfficeService  {
  controller : string = "companies/"
    constructor(protected requestService: RequestService) {
    }
    public FindActiveMainOffices(companyId: string,insuranceId : string): Promise<CompanyInsuranceMainOffice[]>{
      return this.requestService.get(this.controller.concat(companyId + "/insurances/" + insuranceId + "/mainoffices/active")).toPromise()
      .then(res=>{ return <CompanyInsuranceMainOffice[]> res;})
    }
    public PostMainOffice(companyId: string,insuranceId : string,companyInsuranceMainOffice : CompanyInsuranceMainOffice): Promise<CompanyInsuranceMainOffice>{
      return this.requestService.post(this.controller.concat(companyId + "/insurances/" + insuranceId + "/mainoffices"),companyInsuranceMainOffice).toPromise().
      then(res =>{ return <CompanyInsuranceMainOffice> res;})
    }
    public UpdateMainOffice(companyId:string,insuranceId,companyInsuranceMainOffice : CompanyInsuranceMainOffice):Promise<CompanyInsuranceMainOffice>{
      return this.requestService.put(this.controller.concat(companyId + "/insurances/" + insuranceId + "/mainoffices"),companyInsuranceMainOffice).toPromise()
      .then(res=>{return <CompanyInsuranceMainOffice>res})
    }
    public FindAllActive(insuranceCompanyId:string): Promise<CompanyInsuranceMainOffice[]>{
      return this.requestService.get(this.controller.concat(insuranceCompanyId + "/mainoffices/active")).toPromise()
      .then(res=>{ return <CompanyInsuranceMainOffice[]> res;})
    }
    public FindMainOfficeDetails(companyId : string,insuranceId : string,mainOfficeId : string): Promise<CompanyInsuranceMainOffice>{
      return this.requestService.get(this.controller.concat(companyId + "/insurances/" + insuranceId + "/mainoffices/" + mainOfficeId)).toPromise()
      .then(res=>{return <CompanyInsuranceMainOffice> res;})
    }
    public UpdateMainOfficeDetails(companyId : string,insuranceId : string,mainOfficeId : string,companyInsuranceMainOffice : CompanyInsuranceMainOffice): Promise<CompanyInsuranceMainOffice>{
      return this.requestService.put(this.controller.concat(companyId + "/insurances/" + insuranceId + "/mainoffices/" + mainOfficeId),companyInsuranceMainOffice).toPromise()
      .then(res=>{return <CompanyInsuranceMainOffice> res;})
    }
}
