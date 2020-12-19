import { Component, OnInit, ViewChild } from '@angular/core';
import { PolicyHolderService } from '../../services/policy-holder.service';
import { PolicyHolder } from '../../models/policyHolder';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { NotificationsService } from '../../core/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { DeleteConfirmationDirective } from '../../directives/delete.confirmation.directive';
import { environment } from '../../../environments/environment';
import { ArniAutoCompleteComponent } from '../../autocomplete/autocomplete.component';
import { isObject } from 'util';
import { CitiesService } from '../../services/cities.service';
import { City } from '../../models/city';
import { OrderType } from '../../enums/orderType';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-policy-holders',
  templateUrl: './policy-holders.component.html',
  providers: [PolicyHolderService,DeleteConfirmationDirective,CitiesService]
})
export class PolicyHoldersComponent implements OnInit {
  @ViewChild("dt") table : Table;
  @ViewChild("citiesComponent")citiesComponent : ArniAutoCompleteComponent<City>;

  policyHolders: PolicyHolder[] = new Array();
  cities : City[] = new Array();
  selectedCity : City = null;
  SearchText : string;
  filter : any = {};
  totalPolicyHolders : number;
  constructor(
    private policyHolderService: PolicyHolderService,
    private router: Router,
    private notificationService: NotificationsService,
    private translateService:TranslateService,
    public deleteDirective:DeleteConfirmationDirective,
    private citiesService : CitiesService
  ) {}
  getCities(){
    this.citiesService.Find().then(y=>{
      if(y != null){
        this.cities = y.sort((a,b)=>{
          return (a.Name.localeCompare(b.Name,environment.defaultLanguage))
        })
      }
    })
  }
  getPolicyHolders(){
    if (this.SearchText != null)
      this.filter.SearchText = this.SearchText.trim();
    this.policyHolderService.CountAll(this.filter).then(x => { this.totalPolicyHolders = x; })
    this.policyHolderService.FindAll(this.filter).then(y => { this.policyHolders = y; })
  }
  loadPolicyHolders(event : LazyLoadEvent){
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
    this.getPolicyHolders();
  }
  onSelectedCity(event){
    if(isObject(event)){
      this.selectedCity = event;
      this.filter.CityId = this.selectedCity.Id;
    }
    else {
      this.selectedCity = null;
      this.filter.CityId = null;
    }
  }
  addOrEditPolicyHolder(id: string) {
    this.router.navigate(['policyholders/', id]);
  }
  ngOnInit() {
    this.filter.Limit = 10;
    this.filter.Offset = 0;
    this.filter.SortingField = 'Id';
    this.filter.OrderType = OrderType.DESC
    this.filter.SearchText = null;
  }
  onDelete(event) {
    if (event != null) {
      this.policyHolderService.Delete(event).toPromise().then(x => {
        let index = this.policyHolders.findIndex(z => z.Id == event);
        this.policyHolders.splice(index, 1);
        this.notificationService.success("POLICY_HOLDERS_PREVIEW", "DELETED_SUCCESSFULY");
        this.table.reset();
      });
    }
  }
}
