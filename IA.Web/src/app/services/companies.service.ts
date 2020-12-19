import { Injectable } from "@angular/core";
import { BaseCrudService } from "../core/basecrud.service";
import { Company } from "../models/company";
import { TranslateService } from "@ngx-translate/core";
import { RequestService } from "../core/request.service";
import { TokenStorage } from "../core/tokenstorage.service";

@Injectable()
export class CompaniesService extends BaseCrudService<Company>{
  constructor(protected translateService:TranslateService,protected requestService:RequestService, protected tokenStorage : TokenStorage){
    super("companies/",translateService,requestService,tokenStorage);
  }
}
