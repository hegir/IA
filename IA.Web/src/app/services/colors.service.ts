import { Injectable } from '@angular/core';
import { BaseCrudService } from "../core/basecrud.service";
import { TranslateService } from "@ngx-translate/core";
import { RequestService } from "../core/request.service";
import { TokenStorage } from '../core/tokenstorage.service';
import { GreenCardLog } from '../models/greenCardLog';
import { Color } from '../models/color';


@Injectable({
  providedIn: 'root'
})

export class ColorService extends BaseCrudService<Color>{
  constructor(protected translateService:TranslateService,protected requestService:RequestService,protected tokenStorage:TokenStorage) {
    super("colors/",translateService,requestService,tokenStorage);
  }
}
