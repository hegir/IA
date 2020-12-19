import { Injectable } from '@angular/core';
import { RequestService } from "../core/request.service";
import { UserTechnicalInspection } from '../models/userTechnicalInspection';

@Injectable()
export class UserTechnicalInspectionsService  {
  controller : string = "users/"
    constructor(protected requestService: RequestService) {
    }
    public PostUserTechnicalInspection(userId : string,technicalInspectionId:string, insuranceId:string,userTechnicalInspection : UserTechnicalInspection): Promise<UserTechnicalInspection>{
      return this.requestService.post(this.controller.concat(userId + "/technicalinspections/"+technicalInspectionId+"/insurances/"+insuranceId),userTechnicalInspection).toPromise()
      .then(res=>{ return <UserTechnicalInspection> res;})
    }

    public FindById(userId:string,technicalInspectionId:string,insuranceId:string):Promise<UserTechnicalInspection>{
      return this.requestService.get(this.controller.concat(userId + "/technicalinspections/"+technicalInspectionId+"/insurances/"+insuranceId)).toPromise()
      .then(res=> {return <UserTechnicalInspection> res;})
    }
  }
