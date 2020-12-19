import { Injectable } from '@angular/core';
import { BaseCrudService } from "../core/basecrud.service";
import { TranslateService } from "@ngx-translate/core";
import { RequestService } from "../core/request.service";
import { TokenStorage } from '../core/tokenstorage.service';
import { VehicleTypeModel } from '../models/vehicleTypeModel';


@Injectable({
  providedIn: 'root'
})

export class VehicleTypeModelService extends BaseCrudService<VehicleTypeModel>{
  constructor(protected translateService:TranslateService,protected requestService:RequestService,protected tokenStorage:TokenStorage) {
    super("vehicletypesmodels/",translateService,requestService,tokenStorage);
  }
}
