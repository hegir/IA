import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseCrudService } from "../core/basecrud.service";
import { RequestService } from "../core/request.service";
import { PolicyHolder } from '../models/policyHolder';
import { TokenStorage } from '../core/tokenstorage.service';
import { PolicyVehicle } from '../models/vehicle';
import { GreenCard } from '../models/greenCard';
import { PolicyHolderType } from '../enums/policyHolderType';


@Injectable()
export class PolicyHolderService extends BaseCrudService<PolicyHolder> {
    constructor(protected translateService: TranslateService, protected requestService: RequestService,protected tokenStorage:TokenStorage) {
        super("policyholders/", translateService, requestService,tokenStorage);
    }
  public FindAll(filter: any): Promise<PolicyHolder[]> {
    let data: any = {
      limit: filter.Limit,
      offset: filter.Offset,
      sortingColumn: filter.SortingField,
      order: filter.OrderType
    }
    if (filter.SearchText != null)
      data.searchText = filter.SearchText;
    if (filter.CityId != null)
      data.cityId = filter.CityId;
      console.log(filter)
      return this.requestService.get(this.controller.concat('find'),data).toPromise()
      .then(res =>{return <PolicyHolder[]> res;})
    }

  public CountAll(filter : any): Promise<number>{
    let data : any = {}
    if(filter.SearchText != null)
    data.searchText = filter.SearchText;
    if(filter.CityId != null)
    data.cityId = filter.CityId;

    return this.requestService.get(this.controller.concat('find/count'),data).toPromise()
    .then(res =>{return <number> res;})
  }
  public VehiclesOfPolicyHolder(policyHolderId:number):Promise<PolicyVehicle[]>{
    return this.requestService.get(this.controller.concat(policyHolderId+'/vehicles'))
    .toPromise()
    .then(res => { return <PolicyVehicle[]>res });
  }
  public VehiclesDontBelongToPolicyHolder(policyHolderId:number):Promise<PolicyVehicle[]>{
    return this.requestService.get(this.controller.concat(policyHolderId+'/donthave'))
    .toPromise()
    .then(res => { return <PolicyVehicle[]>res });
  }
  public FindAllPolicyHolders(policyHolderType : PolicyHolderType) : Promise<PolicyHolder[]>{
    let data : any = {policyHolderType};
    return this.requestService.get(this.controller.concat('find'),data)
    .toPromise().then(res=>{return <PolicyHolder[]> res;})
  }
}
