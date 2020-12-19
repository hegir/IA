import { Component, OnInit, ViewChild, PipeTransform } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { TranslationsService } from "../../core/translations.service";
import { UsersService } from "../../services/users.service";
import { User } from "../../models/user";
import { NotificationsService } from "../../core/notifications.service";
import { DateFormatPipe } from "../../shared/pipes/dateformat.pipe";
import { OrderType } from "../../../app/enums/orderType";
import Swal from "sweetalert2";
import { NgxPermissionsService } from "ngx-permissions";
import { TokenStorage } from "../../core/tokenstorage.service";
import { environment } from "../../../environments/environment";
import { ArniAutoCompleteComponent } from "../../autocomplete/autocomplete.component";
import { City } from "../../models/city";
import { CitiesService } from "../../services/cities.service";
import { isObject } from "util";
import { LazyLoadEvent } from "primeng/api";
import { Table } from "primeng/table";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  providers: [
    TranslationsService,
    UsersService,
    DateFormatPipe,
    NgxPermissionsService,
    TokenStorage,
    CitiesService
  ],
})
export class UsersComponent implements OnInit {
  @ViewChild("dt") table : Table;
  @ViewChild("citiesComponent") citiesComponent : ArniAutoCompleteComponent<City>
  users: User[] = new Array();
  user: User = new User();
  cities : City[] = new Array();
  selectedCity : City = null;
  hide:true;
  filter : any = {};
  SearchText : string;
  totalUsers : number;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    private permissionService : NgxPermissionsService,
    private tokenStorage : TokenStorage,
    private citiesService : CitiesService
  ) {

  }
  ngOnInit() {
    this.filter.Limit = 10;
    this.filter.Offset = 0;
    this.filter.SortingField = 'Id';
    this.filter.OrderType = OrderType.DESC
    this.filter.SearchText = null;
  }
  onSelectedCity(event){
    if(isObject(event)){
      this.selectedCity = event;
      this.filter.cityId = this.selectedCity.Id;
    }
    else{
      this.selectedCity = null;
      this.filter.cityId = null;
    }
  }
getUsers(){
  if(this.SearchText != null){
    this.filter.SearchText = this.SearchText.trim();
  }
  this.usersService.CountAll(this.filter).then(x=>{this.totalUsers = x});
  this.usersService.FindAll(this.filter).then(y=>{this.users = y;});
}
getCities(){
  this.citiesService.Find().then(y => {
    if (y != null) {
      this.cities = y.sort((a, b) => {
        return (a.Name.localeCompare(b.Name, environment.defaultLanguage));
      })
    }
  })
}
loadUsers(event : LazyLoadEvent){
  if(event.sortField == undefined){
    this.filter.SortingField = 'Id';
  }
  else{
    this.filter.SortingField = event.sortField;
  }
  if(event.sortOrder == undefined){
    this.filter.OrderType = OrderType.DESC;
  }
  else{
    this.filter.OrderType = event.sortOrder == -1 ? OrderType.ASC : event.sortOrder;
  }
  this.filter.Limit = event.rows.toString();
  this.filter.Offset = event.first.toString();
  this.getUsers();
}
  removeUser(id: string) {
    Swal.fire({
      title: this.translateService.instant(
        "ARE_YOU_SURE_TO_WANT_TO_DELETE_THIS_ITEM"
      ),
      text: this.translateService.instant("NO_REVERT_AFTER_THIS"),
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: this.translateService.instant("CANCEL"),
      confirmButtonText: this.translateService.instant("OK"),
      buttonsStyling: false,
    }).then((result) => {
      if (result.value == true) {
        this.usersService
          .Delete(id)
          .toPromise()
          .then((x) => {
            let index = this.users.findIndex((z) => z.Id == Number(id));
            this.users.splice(index, 1);
            this.notificationsService.success("USERS", "DELETED_SUCCESSFULY");
            this.table.reset();
          });
      }
    });
  }

  editUser(id: string) {
    this.router.navigate(["users/", id]);
  }




}
