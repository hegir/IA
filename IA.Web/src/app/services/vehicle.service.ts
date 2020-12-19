import { Injectable } from '@angular/core';
import { BaseCrudService } from "../core/basecrud.service";
import { TranslateService } from "@ngx-translate/core";
import { RequestService } from "../core/request.service";
import { PolicyVehicle } from '../models/vehicle';
import { TokenStorage } from '../core/tokenstorage.service';


@Injectable({
  providedIn: 'root'
})

export class VehicleService extends BaseCrudService<PolicyVehicle>{
  constructor(protected translateService:TranslateService,protected requestService:RequestService,protected tokenStorage:TokenStorage) {
    super("vehicles/",translateService,requestService,tokenStorage);
  }
  public FindAllVehicles():Promise<PolicyVehicle[]>{
    return this.requestService.get(this.controller.concat('allvehicles'))
    .toPromise()
    .then(res => { return <PolicyVehicle[]>res });
  }
}
