import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyHolderService } from '../../../services/policy-holder.service';
import { PolicyHolder } from '../../../models/policyHolder';
import { CitiesService } from '../../../services/cities.service';
import { City } from '../../../models/city';
import { CompanyInsuranceMainOffice } from '../../../models/companyInsuranceMainOffice';
import { InsuranceCompanyService } from '../../../services/insurance-companies.service';
import { FormGroup } from '@angular/forms';
import { ValidationService } from '../../../core/validation.service';
import { NotificationsService } from '../../../core/notifications.service';
import {CompaniesInsurancesMainOfficeService} from '../../../services/companies-insurances-main-offices'
import { TokenStorage } from '../../../core/tokenstorage.service';
import { environment } from '../../../../environments/environment';
import { ArniAutoCompleteComponent } from '../../../autocomplete/autocomplete.component';
import { isObject } from 'util';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { PolicyHolderType } from '../../../enums/policyHolderType';



@Component({
  selector: 'app-policy-holder-details',
  templateUrl: './policy-holder-details.component.html',
  providers: [PolicyHolderService, CitiesService, ValidationService,CompaniesInsurancesMainOfficeService]
})
export class PolicyHolderDetailsComponent implements OnInit {
  @ViewChild('form') form;
  @ViewChild("citiesComponent") citiesComponent: ArniAutoCompleteComponent<City>;

  policyHolderId: string;
  isNewPolicyHolder: boolean;
  policyHolder: PolicyHolder = new PolicyHolder();
  cities: City[] = new Array();
  CompanyInsuranceMainOffices: CompanyInsuranceMainOffice[] = new Array();
  validationErrors: any = null;
  selectedCity : City = null;
  companyId:string;
  policyHolderType = EnumValues.getNamesAndValues(PolicyHolderType);
  constructor(private location: Location,
    private route: ActivatedRoute,
    private policyHolderService: PolicyHolderService,
    private citiesService: CitiesService,
    private validationService: ValidationService,
    private notificationService: NotificationsService,
    private tokenStorage : TokenStorage,
    private translateService : TranslateService,
    private router : Router) {
    this.policyHolderId = this.route.snapshot.paramMap.get('id');
    this.isNewPolicyHolder = this.policyHolderId == '0';
    this.companyId = this.tokenStorage.getCompanyId();
    if (!this.isNewPolicyHolder) {
      this.policyHolderService.FindById(this.policyHolderId).then(x => {
        if (x != null) {
          this.policyHolder = x;
        }
        this.citiesService.Find().then(y => {
          if (y != null) {
            this.cities = y.sort((a,b)=>{
              return (a.Name.localeCompare(b.Name,environment.defaultLanguage));
            });
          }
          this.selectedCity = this.cities.find(z=> z.Id == x.CityId);
        });
      })
    }
    else{
      this.citiesService.Find().then(y => {
        if (y != null) {
          this.cities = y.sort((a,b)=>{
            return (a.Name.localeCompare(b.Name,environment.defaultLanguage));
          });
        }
      });
    }
  }

  ngOnInit() {
  }
  back() {
    this.location.back();
  }
  onSelectedCityChanged(event) {
    if(event == null || event == '')
    return;
    if (isObject(event)) {
      this.selectedCity = event;
      this.policyHolder.CityId = this.selectedCity.Id;
    }
    else {
      this.selectedCity = null;
      this.policyHolder.CityId = null;
    }
  }

  add(form: FormGroup) {
    this.validationErrors = {};
    if (form.invalid) {
      this.validationErrors = this.validationService.PrepareRequiredFieldErrors(form);
    }
    if (this.citiesComponent.autocompleteControl.value == null || this.citiesComponent.autocompleteControl.value == "") {
      this.validationErrors["CityId"] = new Array();
      this.validationErrors["CityId"].push(this.translateService.instant("REQUIRED_FIELD"));
    } else if (!isObject(<City>this.citiesComponent.autocompleteControl.value)) {
      this.validationErrors["CityId"] = new Array();
      this.validationErrors["CityId"].push(this.translateService.instant("NOT_VALID_FIELD"));
    }
    if (Object.keys(this.validationErrors).length > 0)
    return;
      this.policyHolderService.Save(this.policyHolder).then(x => {
        if (x != null) {
          this.policyHolder = x;
          if(this.isNewPolicyHolder){
            this.notificationService.success("POLICY_HOLDER_INFO", "ADDED_SUCCESSFULLY");
            this.router.navigate(['/policyholders']);
          }
          else{
            this.notificationService.success("POLICY_HOLDER_INFO","UPDATED_SUCCESSFULLY");
          }
        }
      });
    }
}
