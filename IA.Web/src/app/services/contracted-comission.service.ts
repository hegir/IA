import { Injectable } from '@angular/core';
import { BaseCrudService } from "../core/basecrud.service";
import { TranslateService } from "@ngx-translate/core";
import { RequestService } from "../core/request.service";
import { TokenStorage } from '../core/tokenstorage.service';
import { ContractedComission } from '../models/contractedComission';


@Injectable({
  providedIn: 'root'
})

export class ContractedComissionService extends BaseCrudService<ContractedComission>{
  constructor(protected translateService:TranslateService,protected requestService:RequestService,protected tokenStorage:TokenStorage) {
    super("contractedcomissions/",translateService,requestService,tokenStorage);
  }
}
