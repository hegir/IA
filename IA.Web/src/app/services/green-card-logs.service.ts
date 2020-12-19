import { Injectable } from '@angular/core';
import { BaseCrudService } from "../core/basecrud.service";
import { TranslateService } from "@ngx-translate/core";
import { RequestService } from "../core/request.service";
import { TokenStorage } from '../core/tokenstorage.service';
import { GreenCardLog } from '../models/greenCardLog';


@Injectable({
  providedIn: 'root'
})

export class GreenCardLogService extends BaseCrudService<GreenCardLog>{
  constructor(protected translateService:TranslateService,protected requestService:RequestService,protected tokenStorage:TokenStorage) {
    super("greencardlogs/",translateService,requestService,tokenStorage);
  }
}
