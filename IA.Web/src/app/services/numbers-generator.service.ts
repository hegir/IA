import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseCrudService } from "../core/basecrud.service";
import { RequestService } from "../core/request.service";
import { TokenStorage } from '../core/tokenstorage.service';
import { NumberGenerator } from '../models/numberGenerator';

@Injectable()
export class NumbersGeneratorService extends BaseCrudService<NumberGenerator> {
    constructor(protected translateService: TranslateService, protected requestService: RequestService, protected tokenStorage : TokenStorage) {
        super("numbers/", translateService, requestService,tokenStorage);
    }
    public FindLastNumber():Promise<NumberGenerator>{
      return this.requestService.get(this.controller.concat("last")).toPromise()
      .then(res=>{return <NumberGenerator> res;})
    }
}
