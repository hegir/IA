import { Injectable } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { BaseCrudService } from "../core/basecrud.service";
import { RequestService } from "../core/request.service";
import { TokenStorage } from "../core/tokenstorage.service";
import { SaveInvoiceItemDto } from "../dtos/saveItemDto";
import { Invoice } from "../models/invoice";
import { InvoiceItem } from "../models/invoiceItem";

@Injectable()
export class InvoicesService extends BaseCrudService<Invoice>{
  constructor(protected translateService: TranslateService, protected requestService: RequestService, protected tokenStorage: TokenStorage) {
    super("invoices/", translateService, requestService, tokenStorage);
  }

  public async FindItems(invoiceId: string):Promise<InvoiceItem[]>
  {
      return this.requestService.get(`${this.controller}${invoiceId}/items`)
      .toPromise()
      .then(res =>{return<InvoiceItem[]>res});
  }

  public async SaveItem(invoiceId: string, item: InvoiceItem):Promise<SaveInvoiceItemDto>
  {
      return this.requestService.post(`${this.controller}${invoiceId}/items`, item)
      .toPromise()
      .then(res =>{return<SaveInvoiceItemDto>res});
  }
}
