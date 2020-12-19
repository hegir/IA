import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../core/notifications.service';
import { ValidationService } from '../../../core/validation.service';
import { Voucher } from '../../../models/voucher';
import { VoucherService } from '../../../services/vouchers.service';
import { FormGroup } from '@angular/forms';
import { VoucherStatus } from '../../../enums/voucherStatus';
import { Partner } from '../../../models/partner';
import { PartnerService } from '../../../services/partners.service';
import { ArniAutoCompleteComponent } from '../../../autocomplete/autocomplete.component';
import { isObject } from 'util';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-voucher-details',
  templateUrl: './voucher-details.component.html',
  providers:[VoucherService,PartnerService,ValidationService,NotificationsService,TranslateService]
})
export class VoucherDetailsComponent implements OnInit {
  public validationErrors: any;
  voucherId:string;
  show:boolean=false;
  isNewVoucher:boolean;
  numberFrom:any;
  numberTo:any;
  vouchers:any=new Array();
  voucherNumbersRange:boolean=false;
  voucher:Voucher=new Voucher();
partners:Partner[]=new Array();
selectedPartner:Partner=new Partner();
@ViewChild("partnerComponent")
  PartnerComponent: ArniAutoCompleteComponent<Partner>;
  @ViewChild('form')form;
  constructor(private location: Location,
    private partnerService:PartnerService,
    private voucherService:VoucherService,
    private route:ActivatedRoute,translateService:TranslateService,
    private notificationService: NotificationsService,
    private validationService:ValidationService,
    private router:Router) {
      this.voucherId=this.route.snapshot.paramMap.get("id");
      this.isNewVoucher=this.voucherId=="0";
      this.partnerService.Find().then(p=>{
        if(p!=null){
          this.partners=p;
        }
      });
      if(!this.isNewVoucher){
        this.voucherService.FindById(this.voucherId).then(v=>{
          if(v!=null){
            this.voucher=v;
            this.partnerService.FindById(this.voucher.PartnerId.toString()).then(x=>{
              if(x!=null){
                this.selectedPartner=x;
                this.selectedPartner.Name=x.Name;
              }
            });
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
    this.validationErrors = {};
    if(this.voucher.PartnerId==null){
      this.validationErrors["Partner"] = new Array();
      this.validationErrors["Partner"].push('* Obavezno polje');
    }
    if(!this.show){
      if(this.voucher.Number==null){
        this.validationErrors["Number"] = new Array();
        this.validationErrors["Number"].push('* Obavezno polje');
      }
    }
    if (Object.keys(this.validationErrors).length > 0)
        return;
    if (form.invalid) {
      this.validationErrors = this.validationService.PrepareRequiredFieldErrors(form);
    }
    else {
      if(this.numberFrom >= this.numberTo){
        this.notificationService.danger("VOUCHERS","VOUCHERS_NUMBER_FROM_CANNOT_BE_HIGHER_THAN_GREEN_CARDS_NUMBER_TO");
        return;
      }
      if (this.isNewVoucher) {
        if (this.voucher.Number == null) {
          for (let index = this.numberFrom; index <= this.numberTo; index++) {
            this.vouchers.push(index);
          }

            this.vouchers.sort();

          this.vouchers.forEach(voucher => {
            let newVoucher = new Voucher();
            newVoucher.Status = VoucherStatus.CreatedVoucher;
            newVoucher.Number = voucher.toString();
            newVoucher.PartnerId = this.voucher.PartnerId;
            newVoucher.Amount = this.voucher.Amount;

            this.voucherService.Save(newVoucher).then(x => {
              if (x != null) {
                newVoucher = x;
              }
            });
          })
          this.notificationService.success("VOUCHERS", "ADDED_SUCCESSFULLY");
          this.router.navigate(['vouchers/']);
          return;
        }
        this.voucher.Status = VoucherStatus.CreatedVoucher;
        this.voucherService.Save(this.voucher).then(x => {
          if (x != null) {
            this.voucher = x;
            this.notificationService.success("VOUCHERS", "ADDED_SUCCESSFULLY");
            this.router.navigate(['vouchers/']);
          }
        })
      }
          else {
            this.voucherService.Save(this.voucher).then(x => {
              if (x != null) {
                this.voucher = x;
                this.notificationService.success("VOUCHERS", "UPDATED_SUCCESSFULLY");
              }
            })
          }
    }
  }
  showRange(event){
    if (event.checked) {
      this.voucher.Number = null;
      this.show = true;
    }
    else {
      this.show = false;
    }
  }
  onSelectedPartnerChanged(e){
    if (e == null || e == "") return;
    if (isObject(e)) {
      this.selectedPartner = e;
      this.voucher.PartnerId = this.selectedPartner.Id;
    } else {
      this.selectedPartner = null;
    }
  }
}
