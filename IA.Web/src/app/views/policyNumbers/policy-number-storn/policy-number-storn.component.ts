import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { ValidationService } from '../../../core/validation.service';
import { Insurance } from '../../../models/insuranceCompany';
import { PolicyNumber } from '../../../models/policyNumber';
import { InsuranceCompanyService } from '../../../services/insurance-companies.service';
import { PolicyNumberService } from '../../../services/policy-number.service';

@Component({
  selector: 'app-policy-number-storn',
  templateUrl: './policy-number-storn.component.html',
  encapsulation : ViewEncapsulation.Emulated,
  styleUrls: ['./policy-number.storn.component.css'],
  providers : [InsuranceCompanyService,PolicyNumberService,ValidationService],
})
export class PolicyNumberStornComponent implements OnInit {
  @ViewChild('form') form;
number : string = null;
insuranceId : number = null;
validationErrors : any;
insurances : Insurance[] = new Array();
policyNumbers : PolicyNumber[] = new Array();
  constructor(public ref : DynamicDialogRef,
    private insuranceCompaniesService : InsuranceCompanyService,
    private policyNumbersService : PolicyNumberService,
    private validationService : ValidationService) {
      this.insuranceCompaniesService.FindAllActive().then(x=>{
        if(x != null){
          this.insurances = x.sort((a,b)=>{
          return a.Name.localeCompare(b.Name,environment.defaultLanguage);
          })
        }
      })
     }

  ngOnInit() {
  }
  storn(form : FormGroup){
    if(form.invalid){
      this.validationErrors=this.validationService.PrepareRequiredFieldErrors(form);
    }
    else{
      this.validationErrors= {};
      let data: any = {
        Number: this.number,
        InsuranceId: this.insuranceId
      }
      this.ref.close(data);
    }

  }
}
