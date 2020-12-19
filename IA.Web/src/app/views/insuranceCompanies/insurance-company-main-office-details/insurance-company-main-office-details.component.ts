import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CompanyInsuranceMainOffice } from '../../../models/companyInsuranceMainOffice';
import { CompaniesInsurancesMainOfficeService } from '../../../services/companies-insurances-main-offices';
import { TokenStorage } from '../../../core/tokenstorage.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ValidationService } from '../../../core/validation.service';
import { NotificationsService } from '../../../core/notifications.service';


@Component({
  selector: 'app-insurance-company-main-office-details',
  templateUrl: './insurance-company-main-office-details.component.html',
  providers : [CompaniesInsurancesMainOfficeService,ValidationService]
})
export class InsuranceCompanyMainOfficeDetailsComponent implements OnInit {
  validationErrors : any = {};
  companyInsuranceMainOffice : CompanyInsuranceMainOffice = new CompanyInsuranceMainOffice
  constructor(private location : Location,
    private companyInsurancesMainOfficesService : CompaniesInsurancesMainOfficeService,
    private tokenStorage : TokenStorage,
    private route:ActivatedRoute,
    private validationService : ValidationService,
    private notificationService : NotificationsService) {
      let companyId = this.tokenStorage.getCompanyId();
      let insuranceId = this.route.snapshot.paramMap.get("insuranceId");
      let mainOfficeid = this.route.snapshot.paramMap.get("mainOfficeid");

      this.companyInsurancesMainOfficesService.FindMainOfficeDetails(companyId,insuranceId,mainOfficeid).then(x=>{
        if(x != null){
          this.companyInsuranceMainOffice = x;
        }
      })
     }

  ngOnInit() {
  }


  back(){
    this.location.back()
  }
  add(form:FormGroup){
    if(form.invalid){
      this.validationErrors=this.validationService.PrepareRequiredFieldErrors(form);
    }
    else{
      let companyId = this.tokenStorage.getCompanyId();
      let insuranceId = this.route.snapshot.paramMap.get("insuranceId");
      let mainOfficeid = this.route.snapshot.paramMap.get("mainOfficeid");
      this.validationErrors={};
      this.companyInsurancesMainOfficesService.UpdateMainOfficeDetails(companyId,insuranceId,mainOfficeid,this.companyInsuranceMainOffice).then(x =>{
        if(x != null){
          this.companyInsuranceMainOffice=x;
        }
      this.notificationService.success("MAIN_OFFICE_INFO", "UPDATED_SUCCESSFULLY");
      })
    }
      }

}

