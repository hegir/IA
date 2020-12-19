import { Injectable } from '@angular/core';
import { BaseCrudService } from "../core/basecrud.service";
import { TranslateService } from "@ngx-translate/core";
import { RequestService } from "../core/request.service";
import { TokenStorage } from '../core/tokenstorage.service';
import { TechnicalInspection } from '../models/technicalInspection';


@Injectable({
  providedIn: 'root'
})

export class TechnicalInspectionService extends BaseCrudService<TechnicalInspection>{
  constructor(protected translateService:TranslateService,protected requestService:RequestService,protected tokenStorage:TokenStorage) {
    super("technicalinspections/",translateService,requestService,tokenStorage);
  }
}
