import { Injectable } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { BaseCrudService } from "../core/basecrud.service";
import { City } from "../models/city";
import { RequestService } from "../core/request.service";
import { User } from "../models/user";
import { TokenStorage } from "../core/tokenstorage.service";
import { Observable } from "rxjs";
import { PasswordChangeDto } from "../dtos/passwordChange";
import { GreenCard } from "../models/greenCard";
import { data } from "jquery";
import {  ExpectedPaymentDto } from "../dtos/expectedPaymentDto";
import { UserTechnicalInspection } from "../models/userTechnicalInspection";

@Injectable()
export class UsersService extends BaseCrudService<User>{
constructor(protected translateService: TranslateService,protected requestService: RequestService,protected tokenStorage:TokenStorage){
    super("users/",translateService,requestService,tokenStorage);
}
public GetPermissions(): Promise<string[]>{
  var permissions = this.tokenStorage.getUserPermissions();
  if(permissions != null){
    return Observable.of(permissions).toPromise();
  }
  return this.requestService.get(this.controller.concat("permissions"),false)
  .toPromise()
  .then(res => <string[]> res)
  .then(data => {this.tokenStorage.setUserPermissions(data); return data;})
}
public ChangePassword(passwordChangeDto: PasswordChangeDto): Promise<boolean> {
  return this.requestService.post(this.controller.concat('passwordchange/'), passwordChangeDto)
      .toPromise()
      .then(res => { return <boolean>res });
}

public FindAllTechnicalInspectionsInsurancesForUser(userId : string):Promise<UserTechnicalInspection[]>{
  return this.requestService.get(this.controller.concat(userId + "/usertechnicalinspectionsinsurances")).toPromise()
  .then(res=> {return <UserTechnicalInspection[]> res;})
}

public ChangePasswordPut(passwordChangeDto: PasswordChangeDto): Promise<boolean> {
  return this.requestService.put(this.controller.concat('passwordchange/'), passwordChangeDto)
      .toPromise()
      .then(res => { return <boolean>res });
}
public CountAllAgents():Promise<number>{
  return this.requestService.get(this.controller.concat("count/agents")).toPromise()
  .then(res=>{return <number> res;})
}
public FindAll(filter : any):Promise<User[]>{
let data : any={
  limit : filter.Limit,
  offset : filter.Offset,
  sortingField : filter.SortingField,
  order : filter.OrderType,
}
if(filter.SearchText != null){
  data.searchText = filter.SearchText
}
if(filter.cityId != null){
  data.cityId = filter.cityId;
}
return this.requestService.get(this.controller.concat('find'),data).toPromise()
.then(res=>{return <User[]> res;})
}

public CountAll(filter : any):Promise<number>
{
  let data : any = {}
  if(filter.SearchText != null){
    data.searchText = filter.SearchText;
  }
  if(filter.cityId != null){
    data.cityId = filter.cityId;
  }
 return  this.requestService.get(this.controller.concat('find/count'),data).toPromise()
  .then(res=>{return <number> res;})
}
public FindAllAgents(): Promise<User[]>{
 return this.requestService.get(this.controller.concat('agents')).toPromise()
  .then(res =>{ return <User[]> res;})
}
public FindAllAssignedAgents() : Promise<User[]>{
  return this.requestService.get(this.controller.concat('agents/assigned')).toPromise()
  .then(res=>{return <User[]> res;})
}
public FindAllPayments() : Promise<ExpectedPaymentDto[]>{
return this.requestService.get(this.controller.concat('payments')).toPromise()
.then(res=>{return <ExpectedPaymentDto[]> res;})
}
}
