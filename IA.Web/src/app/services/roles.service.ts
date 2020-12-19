import { Injectable } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { BaseCrudService } from "../core/basecrud.service";
import { RequestService } from "../core/request.service";
import { Role } from "../models/role";
import { RolePermission } from "../models/rolePermission";
import { Permission } from "../models/permission";
import { TokenStorage } from "../core/tokenstorage.service";

@Injectable()
export class RolesService extends BaseCrudService<Role>{
constructor(protected translateService: TranslateService,protected requestService: RequestService,protected tokenStorage:TokenStorage){
    super("roles/",translateService,requestService,tokenStorage);
}

PostPermission(entity: RolePermission,roleId: string):Promise<RolePermission>{
  return this.requestService.post(this.controller.concat(roleId).concat('/permissions'),entity)
  .toPromise().then(x=> {return <RolePermission> x});
}
GetPermissions(roleId:string):Promise<Permission[]>{
  return this.requestService.get(this.controller.concat(roleId).concat('/permissions'))
  .toPromise().then( res=>{ return <Permission[]> res;})
}
DeletePermission(roleId:string,permissionId:string):Promise<any>{
  return this.requestService.delete(this.controller.concat(roleId).concat('/permissions/').concat(permissionId))
  .toPromise().then( res=> {return  res})
}

}
