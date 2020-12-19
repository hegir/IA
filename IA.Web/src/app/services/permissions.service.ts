import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseCrudService } from "../core/basecrud.service";
import { Permission } from '../models/permission';
import { RequestService } from "../core/request.service";
import { TokenStorage } from '../core/tokenstorage.service';

@Injectable()
export class PermissionsService extends BaseCrudService<Permission> {
    constructor(protected translateService: TranslateService, protected requestService: RequestService,protected tokenStorage:TokenStorage) {
        super("permissions/", translateService, requestService,tokenStorage);
    }

}
