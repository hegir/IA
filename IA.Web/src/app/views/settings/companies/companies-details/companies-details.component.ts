import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CompaniesService } from '../../../../services/companies.service';
import { CitiesService } from '../../../../services/cities.service';
import { CompaniesComponent } from '../companies.component';
import { Company } from '../../../../models/company';
import { City } from '../../../../models/city';
import { FormGroup } from '@angular/forms';
import { ValidationService } from "../../../../core/validation.service";
import { NotificationsService } from '../../../../core/notifications.service';
import { CompaniesInsurancesService } from '../../../../services/companies-insurances';
import { CompanyInsurance } from '../../../../models/companyInsurance';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { ArniAutoCompleteComponent } from '../../../../autocomplete/autocomplete.component';
import { isObject } from 'util';


@Component({
  selector: 'app-companies-details',
  templateUrl: './companies-details.component.html',
  providers : [CompaniesService,CitiesService,ValidationService,CompaniesInsurancesService]
})
export class CompaniesDetailsComponent implements OnInit {
@ViewChild('form') form;
@ViewChild('citiesComponent') citiesComponent : ArniAutoCompleteComponent<City>
companyId : string;
isNewCompany : boolean;
company : Company = new Company();
cities : City[] = new Array();
city : City = null;
validationErrors : any;
companiesInsurances : CompanyInsurance[] = new Array();
selectedCity : City = null;
  constructor(private location : Location,
    private route : ActivatedRoute,
    private companiesService : CompaniesService,
    private citiesService : CitiesService,
    private validationService : ValidationService,
    private notificationService : NotificationsService,
    private companiesInsurancesService : CompaniesInsurancesService,
    private router : Router) {
    this.companyId = this.route.snapshot.paramMap.get("id");
    this.isNewCompany = this.companyId == "0";
    if (!this.isNewCompany) {
      this.companiesService.FindById(this.companyId).then(x => {
        if (x != null) {
          this.company = x;
          this.citiesService.Find().then(y => {
            if (y != null) {
              this.cities = y;
              this.selectedCity = this.cities.find(z => z.Id == x.CityId);
            }
            this.companiesInsurancesService.FindAllCompanies(this.company.Id.toString()).then(c => {
              if (c != null) {
                this.companiesInsurances = c.sort((a,b)=>{
                  return(a.InsuranceName.localeCompare(b.InsuranceName,environment.defaultLanguage))
                });
              }
            })
          })
        }
      })
    }
    else {
      this.citiesService.Find().then(y => {
        if (y != null) {
          this.cities = y;
        }
      })
    }
  }
  getCities(){
    this.citiesService.Find().then(x=>{
      if(x != null){
        this.cities = x;
      }
    })
  }
  onSelectedCity(event){
    if(event == "" || event == undefined)
    return;
    if(isObject(event)){
      this.selectedCity = event;
      this.company.CityId = this.selectedCity.Id;
    }
    else{
      this.selectedCity = null;
      this.company.CityId = null;
    }
  }
  ngOnInit() {
  }
  back(){
this.location.back();
  }

  addCompany(form: FormGroup) {
    this.validationErrors = {};
    if (form.invalid) {
      this.validationErrors = this.validationService.PrepareRequiredFieldErrors(form);
    }
    else {
      this.companiesService.Save(this.company).then(x => {
        if (x != null) {
          if (this.isNewCompany) {
            this.notificationService.success("COMPANY_INFO", "ADDED_SUCCESSFULLY")
          }
          else {
            this.notificationService.success("COMPANY_INFO", "UPDATED_SUCCESSFULLY");
          }
        }
      })
    }
  }
  editInsuranceCompany(insuranceId : string){
    this.router.navigate(['insurancecompanies/', insuranceId])
  }

}
