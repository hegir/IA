import { Injectable } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { BaseCrudService } from "../core/basecrud.service";
import { RequestService } from "../core/request.service";
import { TokenStorage } from "../core/tokenstorage.service";
import { Canton } from "../models/canton";

@Injectable()
export class CantonsService extends BaseCrudService<Canton>{
constructor(protected translateService: TranslateService,protected requestService: RequestService,protected tokenStorage:TokenStorage){
    super("cantons/",translateService,requestService,tokenStorage);
}

}
