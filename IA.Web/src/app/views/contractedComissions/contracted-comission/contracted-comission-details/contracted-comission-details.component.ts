import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../../core/notifications.service';
import { ValidationService } from '../../../../core/validation.service';
import { ContractedComissionService } from '../../../../services/contracted-comission.service';
import { ContractedComission } from '../../../../models/contractedComission';
import { FormGroup } from '@angular/forms';
import { Insurance } from '../../../../models/insuranceCompany';
import { InsuranceCompanyService } from '../../../../services/insurance-companies.service';

@Component({
  selector: 'app-contracted-comission-details',
  templateUrl: './contracted-comission-details.component.html',
  providers:[ContractedComissionService,InsuranceCompanyService,ValidationService]
})
export class ContractedComissionDetailsComponent implements OnInit {
  public validationErrors: any;
  contractedComissionId:string;
  isNewContractedComission:boolean;
  contractedComission:ContractedComission=new ContractedComission();
  insurances:Insurance[]=new Array();
  @ViewChild('form')form;
  constructor(private location: Location,
    private contractedComissionService:ContractedComissionService,private insuranceService:InsuranceCompanyService,
    private route:ActivatedRoute,
    private notificationService: NotificationsService,
    private validationService:ValidationService,
    private router:Router) {
      this.contractedComissionId=this.route.snapshot.paramMap.get("id");
      this.isNewContractedComission=this.contractedComissionId=="0";
      if(!this.isNewContractedComission){
        this.contractedComissionService.FindById(this.contractedComissionId).then( x=>{
          if(x != null){
            this.contractedComission=x;
          }
        });
      }
      this.insuranceService.FindAllActive().then((z)=>{
        if(z!=null){
          this.insurances=z;
        }
      });
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
      this.contractedComissionService.Save(this.contractedComission).then(x =>{
        if(x != null){
          this.contractedComission=x;
          if(this.isNewContractedComission){
          this.notificationService.success("CONTRACTED_COMISSION","ADDED_SUCCESSFULLY");
          this.router.navigate(['/contractedcomissions']);
          }
          else
          this.notificationService.success("CONTRACTED_COMISSION","UPDATED_SUCCESSFULLY");
        }

      });
    }
  }
}
