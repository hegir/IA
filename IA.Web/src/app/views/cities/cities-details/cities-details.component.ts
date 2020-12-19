import { Component, OnInit, ViewChild } from '@angular/core';
import { CitiesService } from '../../../services/cities.service';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ValidationService } from '../../../core/validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../core/notifications.service';
import { City } from '../../../models/city';
import { Canton } from '../../../models/canton';
import { CantonsService } from '../../../services/cantons.service';
import { isObject } from 'util';

@Component({
  selector: 'app-cities-details',
  templateUrl: './cities-details.component.html',
  providers: [CitiesService,CantonsService,ValidationService]
})
export class CitiesDetailsComponent implements OnInit {
  @ViewChild('form') form;
  public validationErrors: any;
  city:City=new City();
  isNewCity:boolean;
  id:string;
  cantons:Canton[]=new Array();



  constructor(private location: Location,private cityService:CitiesService,
    private route:ActivatedRoute,
    private cantonService:CantonsService,
    private notificationService: NotificationsService,
    private validationService:ValidationService,
    private router:Router) {
      this.id=this.route.snapshot.paramMap.get("id");
      this.isNewCity=this.id=="0";
      this.cantonService.Find().then(c=>{
        if(c!=null){
          this.cantons=c;
        }
      });
      if(!this.isNewCity){
        this.cityService.FindById(this.id).then(x=>{
          if(x!=null){
            this.city=x;
          }
        });
      }
     }

  back(){
    this.location.back()
  }


  ngOnInit() {

  }

  add(form:FormGroup){
    if(form.invalid){
      this.validationErrors=this.validationService.PrepareRequiredFieldErrors(form);
    }
    else{
      this.validationErrors={};
      this.cityService.Save(this.city).then(x =>{
        if(x != null){
          this.city=x;
          if(this.isNewCity){
          this.notificationService.success("CITIES","ADDED_SUCCESSFULLY");
          this.router.navigate(['/cities']);
          }
          else
          this.notificationService.success("CITIES","UPDATED_SUCCESSFULLY");
        }

      });
    }
  }
}
