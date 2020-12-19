import { Injectable } from '@angular/core';
import { BaseCrudService } from "../core/basecrud.service";
import { GreenCard } from "../models/greenCard";
import { TranslateService } from "@ngx-translate/core";
import { RequestService } from "../core/request.service";
import { TokenStorage } from '../core/tokenstorage.service';
import { GreenCardLog } from '../models/greenCardLog';


@Injectable({
  providedIn: 'root'
})

export class GreenCardService extends BaseCrudService<GreenCard>{
  constructor(protected translateService:TranslateService,protected requestService:RequestService,protected tokenStorage:TokenStorage) {
    super("greencards/",translateService,requestService,tokenStorage);
  }
  public FindHistory(greenCardId:number,policyHolderId:number):Promise<GreenCardLog[]>{
    return this.requestService.get(this.controller.concat(greenCardId+'/history/'+policyHolderId))
    .toPromise()
    .then(res => { return <GreenCardLog[]>res });
  }
  public FindGreenCardsForAgent():Promise<GreenCard[]>{
    return this.requestService.get(this.controller.concat('agentgreencards'))
    .toPromise()
    .then(res => { return <GreenCard[]>res });
  }

  public FindGreenCardsForDetails():Promise<GreenCard[]>{
    return this.requestService.get(this.controller.concat('greencardsdetails'))
    .toPromise()
    .then(res => { return <GreenCard[]>res });
  }

  public FindAll(filter: any): Promise<GreenCard[]> {
    let data: any = {
      limit: filter.Limit,
      offset: filter.Offset,
      sortingColumn: filter.SortingField,
      order: filter.OrderType,
    }
    if (filter.SearchText != null)
      data.searchText = filter.SearchText;
    if (filter.Status != -1)
      data.status = filter.Status;
    if (filter.AssignedTo != null)
      data.assignedTo = filter.AssignedTo;
    return this.requestService.get(this.controller.concat('find'), data).toPromise()
      .then(res => { return <GreenCard[]>res; })
  }
  public CountAll(filter : any):Promise<number>{
    let data : any = {};
    if(filter.SearchText != null)
    data.searchText = filter.SearchText;
    if(filter.Status != -1)
    data.status = filter.Status
    if(filter.AssignedTo != null)
    data.assignedTo = filter.AssignedTo
    return this.requestService.get(this.controller.concat('find/count'),data).toPromise()
    .then(res =>{return <number> res;})
  }
  public AssignGreenCard(userGreenCardModel : any):Promise<boolean>{
    return this.requestService.post(this.controller.concat('assign'),userGreenCardModel).toPromise()
    .then(res=>{return <boolean> res;})
  }
}
