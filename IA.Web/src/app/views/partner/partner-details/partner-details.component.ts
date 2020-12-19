import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NotificationsService } from '../../../core/notifications.service';
import { ValidationService } from '../../../core/validation.service';
import { DeleteConfirmationDirective } from '../../../directives/delete.confirmation.directive';
import { Partner } from '../../../models/partner';
import { PartnerService } from '../../../services/partners.service';
import { Location } from '@angular/common';
import { City } from '../../../models/city';
import { CitiesService } from '../../../services/cities.service';
import { FormGroup } from '@angular/forms';
import { ArniAutoCompleteComponent } from '../../../autocomplete/autocomplete.component';
import { isObject } from 'util';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-partner-details',
  templateUrl: './partner-details.component.html',
  providers:[PartnerService,CitiesService,ValidationService]
})
export class PartnerDetailsComponent implements OnInit {
  public validationErrors: any;
  partnerId:string;
  isNewPartner:boolean;
  partner:Partner=new Partner();
  cities:City[]=new Array();
  selectedCity:City=new City();
  @ViewChild('form')form;
  @ViewChild("cityComponent")
  citiesComponent: ArniAutoCompleteComponent<City>;
  constructor(private location: Location,
    private partnerService:PartnerService,private cityService:CitiesService,
    private route:ActivatedRoute,
    private notificationService: NotificationsService,
    private validationService:ValidationService,
    private translateService: TranslateService,
    private router:Router) {
      this.partnerId=this.route.snapshot.paramMap.get("id");
      this.isNewPartner=this.partnerId=="0";
      if(!this.isNewPartner){
        this.partnerService.FindById(this.partnerId).then(x=>{
          if(x != null){
            this.partner=x;
            this.cityService.FindById(this.partner.CityId.toString()).then(c=>{
              if(c!=null){
                this.selectedCity=c;
                this.selectedCity.CityNameMunicipalityCode=c.Name+' ('+c.MunicipalityCode+')';
              }
            });
          }
        });
      }
      this.cityService.Find().then((z)=>{
        if(z!=null){
          this.cities=z;
        }
      });
    }

  ngOnInit() {
  }
  back(){
    this.location.back();
  }

  add(form: FormGroup) {
    this.validationErrors = {};
    if (form.invalid) {
      this.validationErrors = this.validationService.PrepareRequiredFieldErrors(form);
    }
    if(this.partner.CityId==null){
      this.validationErrors["City"] = new Array();
      this.validationErrors["City"].push(this.translateService.instant("REQUIRED_FIELD"));
    }
    if (Object.keys(this.validationErrors).length > 0)
    return;

    this.partnerService.Save(this.partner).then(x =>{
      if(x != null){
        this.partner=x;
        if(this.isNewPartner){
        this.notificationService.success("PARTNERS","ADDED_SUCCESSFULLY");
        this.router.navigate(['/partners']);
        }
        else
        this.notificationService.success("PARTNERS","UPDATED_SUCCESSFULLY");
      }
    });
}

  onSelectedCityChanged(e) {
    if (e == null || e == "") return;
    if (isObject(e)) {
      this.selectedCity = e;
      this.partner.CityId = this.selectedCity.Id;
    } else {
      this.selectedCity = null;
    }
  }
}
