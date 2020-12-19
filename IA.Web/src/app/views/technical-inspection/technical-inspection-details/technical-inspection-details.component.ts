import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { TechnicalInspection } from '../../../models/technicalInspection';
import { TechnicalInspectionService } from '../../../services/technical-inspection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../core/notifications.service';
import { ValidationService } from '../../../core/validation.service';
import { FormGroup } from '@angular/forms';
import { ArniAutoCompleteComponent } from '../../../autocomplete/autocomplete.component';
import { City } from '../../../models/city';
import { CitiesService } from '../../../services/cities.service';
import { isObject } from 'util';

@Component({
  selector: 'app-technical-inspection-details',
  templateUrl: './technical-inspection-details.component.html',
  providers:[TechnicalInspectionService,CitiesService,NotificationsService,ValidationService]
})
export class TechnicalInspectionDetailsComponent implements OnInit {
  public validationErrors: any;
  technicalInspectionId:string;
  isNewTechnicalInspection:boolean;
  selectedCity:City=new City();
  cities:City[]=new Array();
  technicalInspection:TechnicalInspection=new TechnicalInspection();
  @ViewChild("cityComponent")
  CitiesComponent: ArniAutoCompleteComponent<City>;

  @ViewChild('form')form;
  constructor(private location: Location,
    private technicalInspectionService:TechnicalInspectionService,
    private route:ActivatedRoute,
    private notificationService: NotificationsService,
    private validationService:ValidationService,
    private router:Router,
    private cityService:CitiesService) {
      this.technicalInspectionId=this.route.snapshot.paramMap.get("id");
      this.isNewTechnicalInspection=this.technicalInspectionId=="0";
      this.cityService.Find().then(y=>{
        if(y!=null){
          this.cities=y;
        }
      });
      if(!this.isNewTechnicalInspection){
        this.technicalInspectionService.FindById(this.technicalInspectionId).then( x=>{
          if(x != null){
            this.technicalInspection=x;
            this.cityService.FindById(this.technicalInspection.CityId.toString()).then(c=>{
              if(c!=null){
                this.selectedCity=c;
                this.selectedCity.CityNameMunicipalityCode=c.Name+'('+c.MunicipalityCode+')';
              }
            })
          }
        });
      }
    }

  ngOnInit() {
  }

  back(){
    this.location.back();
  }

  add(form:FormGroup){
    if(form.invalid){
      this.validationErrors=this.validationService.PrepareRequiredFieldErrors(form);
    }
    else{
      this.validationErrors={};
      this.technicalInspectionService.Save(this.technicalInspection).then(x =>{
        if(x != null){
          this.technicalInspection=x;
          if(this.isNewTechnicalInspection){
          this.notificationService.success("TECHNICAL_INSPECTIONS","ADDED_SUCCESSFULLY");
          this.router.navigate(['/technicalinspections']);
          }
          else
          this.notificationService.success("TECHNICAL_INSPECTIONS","UPDATED_SUCCESSFULLY");
        }
      });
    }
  }
  onSelectedCityChanged(e){
    if (e == null || e == "") return;
    if (isObject(e)) {
      this.selectedCity = e;
      this.technicalInspection.CityId = this.selectedCity.Id;
    } else {
      this.selectedCity = null;
    }
  }
}
