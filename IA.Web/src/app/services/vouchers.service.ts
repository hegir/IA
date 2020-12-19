import { Injectable } from '@angular/core';
import { BaseCrudService } from "../core/basecrud.service";
import { TranslateService } from "@ngx-translate/core";
import { RequestService } from "../core/request.service";
import { TokenStorage } from '../core/tokenstorage.service';
import { Voucher } from '../models/voucher';


@Injectable({
  providedIn: 'root'
})

export class VoucherService extends BaseCrudService<Voucher>{
  constructor(protected translateService:TranslateService,protected requestService:RequestService,protected tokenStorage:TokenStorage) {
    super("vouchers/",translateService,requestService,tokenStorage);
  }
  public AssignVoucher(userVoucherModel : any):Promise<boolean>{
    return this.requestService.post(this.controller.concat('assign'),userVoucherModel).toPromise()
    .then(res=>{return <boolean> res;})
  }

  public FindAll(filter: any): Promise<Voucher[]> {
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
      .then(res => { return <Voucher[]>res; })
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
  public FindAllVouchersOfPartner(partnerId:number):Promise<Voucher[]>{
    return this.requestService.get(this.controller.concat(partnerId+'/vouchers'))
    .toPromise()
    .then(res => { return <Voucher[]>res });
  }
  public FindVoucherOfUser(id:number):Promise<Voucher[]>{
    return this.requestService.get(this.controller.concat(id+'/uservoucher'))
    .toPromise()
    .then(res => { return <Voucher[]>res });
  }
}
