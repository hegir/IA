import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../../core/notifications.service';
import { ValidationService } from '../../../../core/validation.service';
import { PolicyNumberService } from '../../../../services/policy-number.service';
import { PolicyNumber } from '../../../../models/policyNumber';
import { Form, FormGroup } from '@angular/forms';
import { Insurance } from '../../../../models/insuranceCompany';
import { InsuranceCompanyService } from '../../../../services/insurance-companies.service';
import { TokenStorage } from '../../../../core/tokenstorage.service';
import { PolicyNumberStatus } from '../../../../enums/policyNumberStatus';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-policy-number-details',
  templateUrl: './policy-number-details.component.html',
  providers: [PolicyNumberService, InsuranceCompanyService, ValidationService]
})
export class PolicyNumberDetailsComponent implements OnInit {
  public validationErrors: any;
  policyNumberId: string;
  isNewNumber: boolean;
  insuranceCompanies: Insurance[] = new Array();
  policyNumber: PolicyNumber = new PolicyNumber();
  @ViewChild('form') form;
  from: any;
  to: any;
  policyNumbers: any = new Array();
  policyNumbersRange: boolean = false;
  show: boolean = false;

  constructor(private location: Location,
    private policyNumberService: PolicyNumberService, private insuranceCompanyService: InsuranceCompanyService,
    private route: ActivatedRoute,
    private notificationService: NotificationsService,
    private validationService: ValidationService,
    private router: Router,
    private tokenStorage: TokenStorage,
    private translateService: TranslateService) {
    this.policyNumberId = this.route.snapshot.paramMap.get("id");
    this.isNewNumber = this.policyNumberId == "0";
    if (!this.isNewNumber) {
      this.policyNumberService.FindById(this.policyNumberId).then(x => {
        if (x != null) {
          this.policyNumber = x;
        }
      });
    }
    this.insuranceCompanyService.FindAllActive().then((c) => {
      if (c != null) {
        this.insuranceCompanies = c.sort((a,b)=>{
         return a.Name.localeCompare(b.Name,environment.defaultLanguage);
        });
      }
    });
  }

  ngOnInit() {
  }
  back() {
    this.location.back();
  }
  showRange(event) {
    if (event.checked) {
      this.policyNumber.Number = null;
      this.show = true;
    }
    else {
      this.show = false;
    }
  }

  add(form: FormGroup) {
    if (form.invalid) {
      this.validationErrors = this.validationService.PrepareRequiredFieldErrors(form);
    }
    else {
      this.validationErrors = {};
      if (this.isNewNumber) {
        if (this.policyNumber.Number == null) {
          if (this.from >= this.to) {
            this.notificationService.danger("POLICY_NUMBERS", "POLICY_NUMBER_FROM_CANNOT_BE_HIGHER_THAN_POLICY_NUMBER_TO");
            return;
          }
          for (let index = this.from; index <= this.to; index++) {
            this.policyNumbers.push(index);
          }
          setTimeout(() => {
            this.policyNumbers.sort();
          }, 5000);
          this.policyNumbers.forEach(number => {
            this.policyNumber.AddedBy = parseInt(this.tokenStorage.getUserId());
            this.policyNumber.Status = PolicyNumberStatus.Created;
            this.policyNumber.Number = number.toString();
            this.policyNumberService.Save(this.policyNumber).then(x => {
              if (x != null) {
                this.policyNumber = x;
              }
            });
          })
          if (this.isNewNumber) {
            this.notificationService.success("POLICY_NUMBERS", "ADDED_SUCCESSFULLY");
            this.router.navigate(['/policynumbers']);
          }
          return;
        }
        this.policyNumber.AddedBy = parseInt(this.tokenStorage.getUserId());
        this.policyNumber.Status = PolicyNumberStatus.Created;
        this.policyNumberService.Save(this.policyNumber).then(x => {
          if (x != null) {
            this.policyNumber = x;
            if (this.isNewNumber) {
              this.notificationService.success("POLICY_NUMBER", "ADDED_SUCCESSFULLY");
              this.router.navigate(['/policynumbers']);
            }
            else
              this.notificationService.success("POLICY_NUMBER", "UPDATED_SUCCESSFULLY");
          }
        });
      }
      else {
        this.policyNumberService.Save(this.policyNumber).then(x => {
          if (x != null) {
            this.policyNumber = x;
            this.notificationService.success("POLICY_NUMBER", "UPDATED_SUCCESSFULLY");
          }
        })
      }
    }
  }
}
