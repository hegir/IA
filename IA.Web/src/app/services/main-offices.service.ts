import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseCrudService } from "../core/basecrud.service";
import { Permission } from '../models/permission';
import { RequestService } from "../core/request.service";
import { MainOffice } from '../models/mainOffice';
import { TokenStorage } from '../core/tokenstorage.service';

@Injectable()
export class MainOfficesService extends BaseCrudService<MainOffice> {
    constructor(protected translateService: TranslateService, protected requestService: RequestService, protected tokenStorage : TokenStorage) {
        super("mainoffices/", translateService, requestService,tokenStorage);
    }
    public FindAllActive():Promise<MainOffice[]>{
      return this.requestService.get(this.controller.concat("active")).toPromise()
      .then(res=>{return <MainOffice[]> res;})
    }
}
