import { Injectable } from '@angular/core';
import { RequestService } from "../core/request.service";
import { UserMainOffice } from '../models/userMainOffice';
import { User } from '../models/user';

@Injectable()
export class UsersMainOfficesService  {
  controller : string = "users/"
    constructor(protected requestService: RequestService) {
    }
    public PostUserMainOffice(userId : string,userMainOffice : UserMainOffice): Promise<UserMainOffice>{
      return this.requestService.post(this.controller.concat(userId + "/mainoffices"),userMainOffice).toPromise()
      .then(res=>{ return <UserMainOffice> res;})
    }
    public FindAllMainOffices(userId : string):Promise<UserMainOffice[]>{
      return this.requestService.get(this.controller.concat(userId + "/mainoffices")).toPromise()
      .then(res=> {return <UserMainOffice[]> res;})
    }
    public DeleteMainOffice(userId : string,mainOfficeId : string): Promise<UserMainOffice>{
      return this.requestService.delete(this.controller.concat(userId + "/mainoffices/" + mainOfficeId)).toPromise()
      .then(res=>{return <UserMainOffice> res;})
    }
  }
