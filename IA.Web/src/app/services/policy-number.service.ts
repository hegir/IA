import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseCrudService } from "../core/basecrud.service";
import { RequestService } from "../core/request.service";
import { TokenStorage } from '../core/tokenstorage.service';
import { PolicyNumber } from '../models/policyNumber';

@Injectable()
export class PolicyNumberService extends BaseCrudService<PolicyNumber> {
    constructor(protected translateService: TranslateService, protected requestService: RequestService,protected tokenStorage:TokenStorage) {
        super("policynumbers/", translateService, requestService,tokenStorage);
    }
public CountAllActive():Promise<number>{
 return this.requestService.get(this.controller.concat("count/active")).toPromise()
 .then(res=>{return <number>res;})
}

  public FindAll(filter: any): Promise<PolicyNumber[]> {
    let data: any = {
      limit: filter.Limit,
      offset: filter.Offset,
      sortingField: filter.SortingField,
      order: filter.OrderType,
    }
    if (filter.SearchText != null)
      data.searchText = filter.SearchText;
    if (filter.InsuranceId != null)
      data.insuranceId = filter.InsuranceId;
    if (filter.Status != -1)
      data.status = filter.Status;
    if (filter.AssignedTo != null)
      data.assignedTo = filter.AssignedTo;

    return this.requestService.get(this.controller.concat('find'), data).toPromise()
      .then(res => { return <PolicyNumber[]>res; })
  }
public FindAllDashboard(filter : any):Promise<PolicyNumber[]>{
  let data: any = {
    limit: filter.Limit,
    offset: filter.Offset,
    sortingField: filter.SortingField,
    order: filter.OrderType
  }
  if (filter.Status != -1)
    data.status = filter.Status;
  if (filter.SearchText != null)
    data.searchText = filter.SearchText;
  if (filter.InsuranceId != null)
    data.insuranceId = filter.InsuranceId;
  return this.requestService.get(this.controller.concat('dashboard'),data).toPromise()
  .then(res=>{ return <PolicyNumber[]> res;})
}
public FindAllReturned(filter : any):Promise<PolicyNumber[]>{
  let data: any = {
    limit: filter.Limit,
    offset: filter.Offset,
    sortingField: filter.SortingField,
    order: filter.OrderType
  }
  if (filter.Status != -1)
    data.status = filter.Status;
  if (filter.SearchText != null)
    data.searchText = filter.SearchText;
  if (filter.InsuranceId != null)
    data.insuranceId = filter.InsuranceId;
  return this.requestService.get(this.controller.concat('returned'),data).toPromise()
  .then(res=>{ return <PolicyNumber[]> res;})
}
public FindAllDischarged(filter : any):Promise<PolicyNumber[]>{
  let data: any = {
    limit: filter.Limit,
    offset: filter.Offset,
    sortingField: filter.SortingField,
    order: filter.OrderType
  }
  if (filter.Status != -1)
    data.status = filter.Status;
  if (filter.SearchText != null)
    data.searchText = filter.SearchText;
  if (filter.InsuranceId != null)
    data.insuranceId = filter.InsuranceId;
  return this.requestService.get(this.controller.concat('discharged'),data).toPromise()
  .then(res=>{ return <PolicyNumber[]> res;})
}

public CountAll(filter : any):Promise<number>{
  let data : any = {};
  if(filter.SearchText != null)
  data.searchText = filter.SearchText;
  if(filter.InsuranceId != null)
  data.insuranceId = filter.InsuranceId;
  if(filter.Status != -1)
  data.status = filter.Status
  if(filter.AssignedTo != null)
  data.assignedTo = filter.AssignedTo
  return this.requestService.get(this.controller.concat('find/count'),data).toPromise()
  .then(res =>{return <number> res;})
}
public CountAllDashboard(filter : any):Promise<number>{
  let data : any = {};
  if(filter.SearchText != null)
  data.searchText = filter.SearchText;
  if(filter.InsuranceId != null)
  data.insuranceId = filter.InsuranceId;
  if(filter.Status != -1)
  data.status = filter.Status;

  return this.requestService.get(this.controller.concat('dashboard/count'),data).toPromise()
  .then(res =>{return <number> res;})
}
public CountAllReturned(filter : any):Promise<number>{
  let data : any = {};
  if(filter.SearchText != null)
  data.searchText = filter.SearchText;
  if(filter.InsuranceId != null)
  data.insuranceId = filter.InsuranceId;
  if(filter.Status != -1)
  data.status = filter.Status;

  return this.requestService.get(this.controller.concat('returned/count'),data).toPromise()
  .then(res =>{return <number> res;})
}
public CountAllDischarged(filter : any):Promise<number>{
  let data : any = {};
  if(filter.SearchText != null)
  data.searchText = filter.SearchText;
  if(filter.InsuranceId != null)
  data.insuranceId = filter.InsuranceId;
  if(filter.Status != -1)
  data.status = filter.Status;

  return this.requestService.get(this.controller.concat('discharged/count'),data).toPromise()
  .then(res =>{return <number> res;})
}


public FindAllAvailablePolicyNumbers():Promise<PolicyNumber[]>{
  return this.requestService.get(this.controller.concat("availablepolicynumbers")).toPromise()
  .then(res=>{return <PolicyNumber[]>res;})
 }
 public Assign(userPolicyNumberModel : any):Promise<boolean>{
   return this.requestService.post(this.controller.concat('assign'),userPolicyNumberModel).toPromise()
   .then(res=>{return <boolean> res;})
 }
 public FindAllCreatedPolicyNumbers():Promise<PolicyNumber[]>{
   return this.requestService.get(this.controller.concat('created')).toPromise()
   .then(res=>{return <PolicyNumber[]> res;})
 }
 public StornPolicyNumber(policyNumber : PolicyNumber): Promise<boolean>{
   return this.requestService.put(this.controller.concat('storned'),policyNumber).toPromise()
   .then(x=>{return <boolean> x;})
 }
}
