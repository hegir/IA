import { Injectable } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { BaseCrudService } from "../core/basecrud.service";
import { City } from "../models/city";
import { RequestService } from "../core/request.service";
import { TokenStorage } from "../core/tokenstorage.service";

@Injectable()
export class CitiesService extends BaseCrudService<City>{
constructor(protected translateService: TranslateService,protected requestService: RequestService,protected tokenStorage:TokenStorage){
    super("cities/",translateService,requestService,tokenStorage);
}
public FindAllCities(filter : any):Promise<City[]>{
  let data : any = {
    limit : filter.Limit,
    offset : filter.Offset,
    sortingField : filter.SortingField,
    order : filter.OrderType,
  }
  if (filter.SearchCityName != null)
    data.searchCityName = filter.SearchCityName;

    if (filter.SearchPostCode != null)
    data.searchPostCode = filter.SearchPostCode;

    if (filter.SearchMunicipalityCode != null)
    data.searchMunicipalityCode = filter.SearchMunicipalityCode;

    if (filter.SearchCanton != null)
    data.searchCanton = filter.SearchCanton;

  return this.requestService.get(this.controller.concat('find'),data).toPromise()
  .then(res=>{ return <City[]> res;})
}
public CountAll(filter : any): Promise<number>{
  let data : any = {}
  if (filter.SearchCityName != null)
    data.searchCityName = filter.SearchCityName;

    if (filter.SearchPostCode != null)
    data.searchPostCode = filter.SearchPostCode;

    if (filter.SearchMunicipalityCode != null)
    data.searchMunicipalityCode = filter.SearchMunicipalityCode;

    if (filter.SearchCanton != null)
    data.searchCanton = filter.SearchCanton;

  return this.requestService.get(this.controller.concat('find/count'),data).toPromise()
  .then(res =>{return <number> res;})
}
}
