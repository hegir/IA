import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { PolicyPayment } from '../../../../models/policyPayments';
import { Policy } from '../../../../models/policy';
import { PolicyService } from '../../../../services/policy.service';
import { ActivatedRoute } from '@angular/router';
import { EnumValues } from 'enum-values';
import { PaymentMethod } from '../../../../enums/paymentMethod';
import { DateAdapter, MatDatepicker, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Moment } from 'moment';
import { FormGroup } from '@angular/forms';
import { ValidationService } from '../../../../core/validation.service';
import { PolicyPaymentsService } from '../../../../services/policy-payments.service';
import { Table } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../../../core/notifications.service';
import { TokenStorage } from '../../../../core/tokenstorage.service';
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY.',
  },
  display: {
    dateInput: 'DD.MM.YYYY.',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-policy-payments',
  templateUrl: './policy-payments.component.html',
  providers: [PolicyService, TranslateService, NotificationsService, ValidationService, PolicyPaymentsService, { provide: DateAdapter, useClass: MomentDateAdapter }, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class PolicyPaymentsComponent implements OnInit {
  @ViewChild('form') form;
  @ViewChild('dt') table: Table;
  policyPayment: PolicyPayment = new PolicyPayment();
  policyPayments: PolicyPayment[] = new Array()
  policy: Policy = new Policy();
  policyId: string;
  validationErrors: any = {};
  public paymentMethod = EnumValues.getNamesAndValues(PaymentMethod);
  sum: number;
  numberOfInstallments: number;
  payment: number;
  price: number;
  date: Date = new Date();
  disableButton: boolean = false;
  expectedDate: Date = new Date();
  month: number;
  totalPaymentPrice: number;
  disableTotalPremiumPrice: boolean = false;
  disablePaymentMethod: boolean = false;
  isAdmin: boolean = false;
  constructor(
    private location: Location,
    private policiesService: PolicyService,
    private route: ActivatedRoute,
    private validationService: ValidationService,
    private policyPaymentsService: PolicyPaymentsService,
    private translateService: TranslateService,
    private notificationsService: NotificationsService,
    private tokenStorage: TokenStorage
  ) {
    this.isAdmin = this.tokenStorage.getUserPermissions().find(x => x == 'P_POLICY_PAYMENT_RATE_DELETE') == 'P_POLICY_PAYMENT_RATE_DELETE';
    this.policyId = this.route.snapshot.paramMap.get("id");
    this.policyPaymentsService.FindAllPayments(this.policyId).then(x => {
      this.policyPayments = x;
    })
    this.policiesService.FindById(this.policyId).then(x => {
      if (x) {
        this.policy = x;
        this.sum = this.policy.RemainingDebt;
        this.numberOfInstallments = this.policy.NumberOfInstallment;
        this.price = null;
        if (this.policy.TotalPaymentPrice == 0) {
          this.policy.Payment = -1;
        }
        else {
          this.payment = this.policy.Payment;
        }
        if (this.policy.TotalPaymentPrice == 0) {
          this.totalPaymentPrice = null
        }
        else {
          this.totalPaymentPrice = this.policy.TotalPaymentPrice;
        }
        if (this.payment == 0) {
          this.price = this.policy.RemainingDebt;
        }
        else {
          this.price = null;
        }
        if (this.policy.Payment == 1) {
          this.price = null
        }
        if (this.policyPayments.length > 0) {
          this.expectedDate = this.policy.ExpectedPaymentDate;
        }
        else {
          this.expectedDate = undefined;
        }
        if (this.numberOfInstallments == 1) {
          this.expectedDate = this.date;
        }
      }
    })
  }

  ngOnInit() {
  }
  back() {
    this.location.back();
  }
  showDatePicker(picker: MatDatepicker<Moment>) {
    picker.open();
  }
  add(form: FormGroup) {
    this.validationErrors = {};
    if (form.invalid) {
      this.validationErrors = this.validationService.PrepareRequiredFieldErrors(form);
    }
    else {
      if (this.payment != -1) {
        if (this.price > this.policy.RemainingDebt && this.policy.NumberOfInstallment > 0) {
          this.notificationsService.danger("POLICY_PAYMENT_DETAILS", "INSTALLMENT_IS_GREATER_THAN_REMAINING_DEBT");
          return;
        }
        if (this.price > this.totalPaymentPrice) {
          this.notificationsService.danger("POLICY_PAYMENT_DETAILS", "INSTALLMENT_IS_GREATER_THAN_REMAINING_DEBT");
          return;
        }
        if (this.policy.TotalPaymentPrice == 0) {
          this.policy.TotalPaymentPrice = this.totalPaymentPrice;
          this.policy.RemainingDebt = this.policy.TotalPaymentPrice;
          this.policy.Payment = this.payment;
          this.policiesService.Update(this.policy)
        }
        this.policyPayment.PolicyId = parseInt(this.policyId);
        this.policyPayment.Installment = this.numberOfInstallments;
        this.policyPayment.PaymentMethod = this.payment;
        this.policyPayment.Amount = this.price;
        this.policyPayment.PaymentDate = this.date;
        this.policyPayment.ExpectedPaymentDate = this.expectedDate;
        this.policyPaymentsService.Save(this.policyId, this.policyPayment).then(x => {
          if (x != null) {
            this.policyPayment = x;
            this.RemainingDebt(this.policyPayment);
            this.policyPayments.push(this.policyPayment);
            this.disableButton = true;
            this.disableTotalPremiumPrice = true;
            this.disablePaymentMethod = true;
          }
        })
      }
    }
  }
  public RemainingDebt(policyPayment: PolicyPayment) {
    this.sum = this.policy.RemainingDebt;
    this.sum -= policyPayment.Amount;
    if (this.sum < 0) {
      this.sum = this.policy.RemainingDebt;
    }
    else {
      return this.sum;
    }
  }
  changePaymentMethod(event) {
    if (event.value == 0) {
      this.policy.Payment = 0
      this.payment = 0;
      this.price = this.totalPaymentPrice;
      this.numberOfInstallments = 0
    }
    else {
      this.policy.Payment = 1;
      this.payment = 1
      this.price = null;
      this.numberOfInstallments = null;
    }
  }
  removePolicyPaymentRate(event) {
    if (event != null) {
      let policyRate = new PolicyPayment();
      this.policyPaymentsService.FindPaymentById(parseInt(this.policyId),event).then(p=>{
        policyRate = p;
         this.policyPaymentsService.DeletePolicyPayment(policyRate.PolicyId, policyRate.Id).then(x => {
        if (x != null) {
          this.policiesService.FindById(this.policyId).then(y => {
            if (y != null)
              this.policy = y;
            this.policy.RemainingDebt = this.policy.RemainingDebt + policyRate.Amount;
            this.sum = this.policy.RemainingDebt;
            if (this.policy.Payment == PaymentMethod.Cash) {
              this.policy.TotalPaymentPrice = 0;
              this.policy.RemainingDebt = 0;
            }
            if(this.policy.Payment == PaymentMethod.Financial){
              this.policy.NumberOfInstallment += 1;
            }
            this.policiesService.Update(this.policy).then(y => {
              if (y != null) {
                let index = this.policyPayments.findIndex(z => z.Id == policyRate.Id)
                this.policyPayments.splice(index, 1);
                this.notificationsService.success("POLICY_PAYMENT_DETAILS","DELETED_SUCCESSFULY");
              }
            })
            this.disableTotalPremiumPrice = false;
          })
        }
      })
      })

    }
  }
}
