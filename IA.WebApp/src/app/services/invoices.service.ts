import { Injectable } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { BaseCrudService } from "../core/basecrud.service";
import { RequestService } from "../core/request.service";
import { TokenStorage } from "../core/tokenstorage.service";
import { Observable } from "rxjs";
import { Invoice } from "../models/invoice";

@Injectable()
export class InvoicesService extends BaseCrudService<Invoice>{
  constructor(protected translateService: TranslateService, protected requestService: RequestService, protected tokenStorage: TokenStorage) {
    super("invoices/", translateService, requestService, tokenStorage);
  }
}
