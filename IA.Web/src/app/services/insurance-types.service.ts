import { Injectable } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { BaseCrudService } from "../core/basecrud.service";
import { RequestService } from "../core/request.service";
import { TokenStorage } from "../core/tokenstorage.service";
import { InsuranceType } from "../models/insuranceTypes";

@Injectable()
export class InsuranceTypesService extends BaseCrudService<InsuranceType>{
  constructor(protected translateService: TranslateService, protected requestService: RequestService, protected tokenStorage: TokenStorage) {
    super("insurancetypes/", translateService, requestService, tokenStorage);
  }
}
