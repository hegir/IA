import { Injectable } from '@angular/core';
import { BaseCrudService } from "../core/basecrud.service";
import { TranslateService } from "@ngx-translate/core";
import { RequestService } from "../core/request.service";
import { TokenStorage } from '../core/tokenstorage.service';
import { Partner } from '../models/partner';
import { Voucher } from '../models/voucher';


@Injectable({
  providedIn: 'root'
})

export class PartnerService extends BaseCrudService<Partner>{
  constructor(protected translateService:TranslateService,protected requestService:RequestService,protected tokenStorage:TokenStorage) {
    super("partners/",translateService,requestService,tokenStorage);
  }
  public FindAllPartnersWithActiveVouchers():Promise<Partner[]>{
    return this.requestService.get(this.controller.concat('activevouchers'))
    .toPromise()
    .then(res => { return <Partner[]>res });
  }
}
