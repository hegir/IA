import { Component, OnInit, ViewChild } from '@angular/core';
import { City } from '../../models/city';
import { TranslateService } from '@ngx-translate/core';
import { CitiesService } from '../../services/cities.service';
import { Router } from '@angular/router';
import { NotificationsService } from '../../core/notifications.service';
import { DeleteConfirmationDirective } from '../../directives/delete.confirmation.directive';
import { Canton } from '../../models/canton';
import { CantonsService } from '../../services/cantons.service';
import { LazyLoadEvent } from "primeng/api";
import { OrderType } from '../../enums/orderType';
import { isObject } from 'util';
import { ArniAutoCompleteComponent } from '../../autocomplete/autocomplete.component';



@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  providers: [CitiesService,CantonsService,DeleteConfirmationDirective]
})
export class CitiesComponent implements OnInit {
  @ViewChild('dt') table;
  cities : City[] = new Array();
  numberOfCities: number;
  selectedCities: City[] = new Array();
searchCityName:string;
searchPostCode:string;
totalCities:number;
searchMunicipalityCode:string;
cantons:Canton[]=new Array();
filter : any = {};
selectedCanton:Canton=null;
@ViewChild("cantonComponent") cantonComponent : ArniAutoCompleteComponent<Canton>




  constructor(private citiesService: CitiesService,private router : Router,
    private cantonService:CantonsService,
    private notificationService: NotificationsService,private translateService:TranslateService,
    public deleteDirective:DeleteConfirmationDirective) {
      this.cantonService.Find().then(c=>{
        if(c!=null){
          this.cantons=c;
        }
      });
      // this.filter.Limit = 10;
      // this.filter.Offset = 0;
      // this.filter.SortingField = 'Id';
      // this.filter.OrderType = OrderType.DESC;
      // this.filter.SearchCityName = null;
      // this.filter.SearchPostCode = null;
      // this.filter.SearchMunicipalityCode = null;
      // this.filter.SearchCanton = null;
      // this.searchCityName=null;
      // this.searchMunicipalityCode=null;
      // this.searchPostCode=null;
      // this.citiesService.FindAllCities(this.filter).then( x =>{
      //   this.cities = x;
      //   });
  }



  ngOnInit() {
    this.filter.Limit = 10;
    this.filter.Offset = 0;
    this.filter.SortingField = 'Id';
    this.filter.OrderType = OrderType.DESC;
    this.filter.SearchCityName = null;
    this.filter.SearchPostCode = null;
    this.filter.SearchMunicipalityCode = null;
    this.filter.SearchCanton = null;
  }

  editCity(id : string){
    this.router.navigate(['cities/',id])
  }
  onDelete(event) {
    if (event != null) {
      this.citiesService.Delete(event).toPromise().then(x => {
        let index = this.cities.findIndex(z => z.Id == event);
        this.cities.splice(index, 1);
        this.notificationService.success("CITIES", "DELETED_SUCCESSFULY");
      });
    }
  }
  getCities(){
    if(this.searchCityName!=null)
  this.filter.SearchCityName=this.searchCityName;

    if(this.searchPostCode!=null)
  this.filter.SearchPostCode=this.searchPostCode;

   if(this.searchMunicipalityCode!=null)
  this.filter.SearchMunicipalityCode=this.searchMunicipalityCode;

this.citiesService.CountAll(this.filter).then(c=>{
  if(c!=null)
  this.totalCities=c;
});
this.citiesService.FindAllCities(this.filter).then(x=>
  {
    if(x!=null)
      this.cities=x;
  });

}

  onSelectedCanton(e){
    if(isObject(e)){
      this.selectedCanton = e;
      this.filter.SearchCanton = this.selectedCanton.Id;
    }
    else{
      this.selectedCanton = null;
      this.filter.SearchCanton = null;
    }
  }

  loadCities(event:LazyLoadEvent){
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
    this.getCities();
  }
}
