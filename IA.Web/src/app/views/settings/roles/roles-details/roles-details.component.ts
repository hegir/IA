import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { Role } from "../../../../models/role";
import { RolesService } from "../../../../services/roles.service";
import { NotificationsService } from "../../../../core/notifications.service";
import { NgForm, FormGroup } from "@angular/forms";
import { PermissionsService } from "../../../../services/permissions.service";
import { Permission } from "../../../../models/permission";
import { ValidationService } from "../../../../core/validation.service";
import { environment } from "../../../../../environments/environment";
import { MatCheckboxChange } from "@angular/material";
import { RolePermission } from "../../../../models/rolePermission";
import { isNullOrUndefined } from "util";

@Component({
  selector: "app-roles-details",
  templateUrl: "./roles-details.component.html",
  providers: [RolesService, PermissionsService,ValidationService],
})
export class RolesDetailsComponent implements OnInit {
  @ViewChild('form')form;
  roleId: string;
  isNewRole : boolean;
  role: Role = new Role();
  permissions: Permission[] = new Array();
  public validationErrors: any;
  roles: Role[]= new Array();
  rp: RolePermission= new RolePermission();
  rolePermissions: Permission[]= new Array();
  permission: Permission=new Permission();
  showPermissions : boolean = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private rolesService: RolesService,
    private notificationService: NotificationsService,
    private permissionsService: PermissionsService,
    private validationService:ValidationService,
    private router:Router
  ) {
    this.roleId = this.route.snapshot.paramMap.get("id");
    this.isNewRole=this.roleId=="0";
    if (!this.isNewRole) {
      this.rolesService.FindById(this.roleId).then((x) => {
        this.role = x;
      });
      this.permissionsService.Find().then(x=>{
        if(x != null){
          this.permissions=x.sort((a,b) =>{
            return (a.Description.localeCompare(b.Description,environment.defaultLanguage))
          })
          this.loadRolePermission();
        }
      })
      this.showPermissions = true;
    }

  }

  ngOnInit() {

  }

  back() {
    this.location.back();
  }

  add(form: FormGroup) {
    if (form.invalid) {
      this.validationErrors = this.validationService.PrepareRequiredFieldErrors(form);
    }
    else {
      this.validationErrors = {};
      this.rolesService.Save(this.role).then(x => {
        if (x != null) {
          this.role = x;
          this.roles.push(this.role);
          if (this.isNewRole) {
            this.showPermissions = true;
            this.permissionsService.Find().then(x=>{
              if(x != null){
                this.permissions=x.sort((a,b) =>{
                  return (a.Description.localeCompare(b.Description,environment.defaultLanguage))
                })
              }
            })
            this.router.navigate(['roles']);
          }
          else {
            this.notificationService.success("ROLE_INFO", "UPDATED_SUCCESSFULLY");
          }

        }
      })
    }
  }

  addPermission(permission : Permission,event:MatCheckboxChange){
    permission.IsChecked=event.checked;
    if(event.checked){
      let p =new RolePermission();
      p.PermissionId=permission.Id;
      this.rolesService.PostPermission(p,this.role.Id).then(x =>{
        if(x != null){
          this.rp=x;
          this.notificationService.success("ROLE_DETAILS","SAVED_SUCCESS");
          this.loadRolePermission();
        }
      })
    }
    else{
      let perm = this.rolePermissions.find(x=>x.Id == permission.Id);
      if(perm != null){
        this.rolesService.DeletePermission(this.role.Id,perm.Id).then( x=>{
          if( x != null){
            this.rp=x;
            this.notificationService.success("ROLE_DETAILS","PERMISSION_REMOVED");
            this.loadRolePermission();
          }
        })
      }
    }
  }
  loadRolePermission(){
    this.rolesService.GetPermissions(this.role.Id).then( x=>{
      this.rolePermissions=x.sort((a,b)=>{
        return a.Description.localeCompare(b.Description,environment.defaultLanguage)
      })
      this.permissions.forEach(permission =>{
        let rolePermission = this.rolePermissions.find(x=>x.Id == permission.Id);
        if(rolePermission != null){
          permission.IsChecked=true;
        }
      })
    })
  }
}
