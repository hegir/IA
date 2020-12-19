import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InsuranceType } from '../../../models/insuranceTypes';
import { InsuranceTypesService } from '../../../services/insurance-types.service';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ValidationService } from '../../../core/validation.service';
import { NotificationsService } from '../../../core/notifications.service';

@Component({
  selector: 'app-insurance-types-details',
  templateUrl: './insurance-types-details.component.html',
  providers : [InsuranceTypesService,ValidationService]
})
export class InsuranceTypesDetailsComponent implements OnInit {
insuranceTypeId : string;
isNewInsuranceType : boolean;
insuranceType : InsuranceType = new InsuranceType();
validationErrors : any = {};
  constructor(private route: ActivatedRoute,
    private insuranceTypeService : InsuranceTypesService,
    private location : Location,
    private validationService : ValidationService,
    private notificationService : NotificationsService,
    private router : Router) {
    this.insuranceTypeId = this.route.snapshot.paramMap.get("id");
    this.isNewInsuranceType = this.insuranceTypeId == "0";
if(!this.isNewInsuranceType){
this.insuranceTypeService.FindById(this.insuranceTypeId).then(x=>{
  if(x != null){
    this.insuranceType = x;
  }
})
}
   }

  ngOnInit() {
  }
  back(){
    this.location.back();
  }
  add(form : FormGroup){
if(form.invalid){
  this.validationErrors = this.validationService.PrepareRequiredFieldErrors(form);
}
else{
  this.validationErrors = {};
  this.insuranceTypeService.Save(this.insuranceType).then(x=>{
    if(x != null){
      this.insuranceType = x;
      if(this.isNewInsuranceType){
        this.notificationService.success("INSURANCE_TYPES_PREVIEW","ADDED_SUCCESSFULLY");
        this.router.navigate(['/insurancetypes']);
      }
      else{
        this.notificationService.success("INSURANCE_TYPES_PREVIEW","UPDATED_SUCCESSFULLY");
      }
    }
  })
}
  }
}
