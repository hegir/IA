import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from '../../../core/notifications.service';
import { DeleteConfirmationDirective } from '../../../directives/delete.confirmation.directive';
import { PolicyService } from '../../../services/policy.service';
import { DateFormatPipe } from '../../../shared/pipes/dateformat.pipe';
import { Policy } from '../../../models/policy';
import { EnumValues } from 'enum-values';
import { InsuranceTypes } from '../../../enums/insuranceType';
import { isObject } from 'util';
import { InsuranceCompanyService } from '../../../services/insurance-companies.service';
import { Insurance } from '../../../models/insuranceCompany';
import { ArniAutoCompleteComponent } from '../../../autocomplete/autocomplete.component';
import { PolicyHolderService } from '../../../services/policy-holder.service';
import { PolicyHolder } from '../../../models/policyHolder';
import { environment } from '../../../../environments/environment';
import { PolicyNumberService } from '../../../services/policy-number.service';
import { PolicyNumber } from '../../../models/policyNumber';
import { OrderType } from '../../../enums/orderType';
import { DialogService, LazyLoadEvent } from 'primeng/api';
import { DateAdapter, MatDatepicker, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { FormControl } from '@angular/forms';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../dateformat/format-datepicker';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MomentUtcDateAdapter } from '../../../dateformat/momentutcdateformat';
import { TokenStorage } from '../../../core/tokenstorage.service';
import { User } from '../../../models/user';
import { UsersService } from '../../../services/users.service';
import { PolicyNumberStornComponent } from '../../policyNumbers/policy-number-storn/policy-number-storn.component';
import { TranslateService } from '@ngx-translate/core';
import { PolicyNumberStatus } from '../../../enums/policyNumberStatus';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  providers: [ DateFormatPipe, DeleteConfirmationDirective, UsersService, InsuranceCompanyService, DialogService,PolicyHolderService, PolicyNumberService,TranslateService,
  PolicyService,NgxPermissionsService,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    ]
})
export class PolicyComponent implements OnInit {
  @ViewChild("insurancesComponent") insurancesComponent: ArniAutoCompleteComponent<Insurance>;
  @ViewChild("policyHoldersComponent") policyHoldersComponent: ArniAutoCompleteComponent<PolicyHolder>;
  @ViewChild("policyNumbersComponent") policyNumbersComponent: ArniAutoCompleteComponent<PolicyNumber>;
  @ViewChild("usersComponent") usersComponent: ArniAutoCompleteComponent<User>;
  @ViewChild("dt") table;
  @ViewChild("expirationDatePicker") expirationDatePicker: MatDatepicker<Date>;
  @ViewChild("beginPicker") beginPicker: MatDatepicker<Date>;
  @ViewChild("expirationDatePickerUntil") expirationDatePickerUntil: MatDatepicker<Date>;
  @ViewChild("beginPickerUntil") beginPickerUntil: MatDatepicker<Date>;
  public InsuranceTypes = EnumValues.getNamesAndValues(InsuranceTypes);
  policies: Policy[] = new Array();
  selectedInsurance: Insurance = null;
  insurances: Insurance[] = new Array();
  policyHolders: PolicyHolder[] = new Array();
  selectedPolicyHolder: PolicyHolder = new PolicyHolder();
  policyNumbers: PolicyNumber[] = new Array();
  selectedPolicyNumber: PolicyNumber = null;
  policyBegin:Date=null;
  policyBeginUntil:Date=null;
  policyExpiration:Date=null;
  policyExpirationUntil:Date=null;
  filter:any={};
  searchText:string;
  searchInsurance:string;
  searchUser:string;
  totalPolicies:number;
  isAdmin:boolean=false;
  users:User[]=new Array();
  selectedUser:User=null;
  policyNumber : PolicyNumber = new PolicyNumber();
  todayDate:Date;
  policyHolder: PolicyHolder = new PolicyHolder();

  constructor(private policyService: PolicyService,
    private router: Router,
    private notificationService: NotificationsService,
    public deleteDirective: DeleteConfirmationDirective,
    private insurancesService: InsuranceCompanyService,
    private policyHoldersService: PolicyHolderService,
    private policyNumbersService: PolicyNumberService,
    private userService:UsersService,
    private permissionService : NgxPermissionsService,
    private dateFormat : DateFormatPipe,
    private tokenStorage:TokenStorage,
    private dialogService :DialogService,
    private translateService : TranslateService) {
      this.isAdmin = this.tokenStorage.getUserPermissions().find(x => x == 'P_POLICIES_ALL') == 'P_POLICIES_ALL';

  var mainTodayDate=new Date();
  this.todayDate=mainTodayDate;

      this.insurancesService.FindAllActive().then(y => {
        if (y != null) {
          this.insurances = y.sort((a, b) => {
            return (a.Name.localeCompare(b.Name, environment.defaultLanguage))
          });
        }
        this.policyHoldersService.Find().then(z => {
          if (z != null) {
            this.policyHolders = z.sort((a, b) => {
              return (a.FullName.localeCompare(b.FullName, environment.defaultLanguage))
            });
          }

          this.policyNumbersService.Find().then(k => {
            if (k != null) {
              this.policyNumbers = k.sort((a, b) => {
                return (a.Id.toString().localeCompare(b.Id.toString(), environment.defaultLanguage))
              });
            }
          });
        });
      });
      this.userService.Find().then(u=>{
        if(u!=null){
          this.users = u.sort((a, b) => {
            return (a.FullName.localeCompare(b.FullName, environment.defaultLanguage))
          });
        }
      });
  }
  ngOnInit() {
    this.filter.Limit = 10;
    this.filter.Offset = 0;
    this.filter.SortingField = 'Id';
    this.filter.OrderType = OrderType.DESC
    this.filter.SearchText = null;
    this.filter.SearchInsurance=null;
  }
  loadPolicies(event : LazyLoadEvent){
    if(event.sortField == undefined){
      this.filter.SortingField = 'Id';
    }
    else{
      this.filter.SortingField = event.sortField;
    }
    if(event.sortOrder == undefined){
      this.filter.OrderType = OrderType.DESC;
    }
    else{
      this.filter.OrderType = event.sortOrder == -1 ? OrderType.ASC : event.sortOrder;
    }
    this.filter.Limit = event.rows.toString();
    this.filter.Offset = event.first.toString();
    this.getPolicies();
  }
getPolicies(){
if(this.searchText!=null)
  this.filter.SearchText=this.searchText.trim();

  if(this.searchInsurance!=null)
  this.filter.SearchInsurance=this.searchInsurance.trim();

if(this.policyBegin!=null)
  this.filter.PolicyBegin=this.policyBegin;
else
  this.filter.PolicyBegin=null;

if(this.policyBeginUntil!=null)
  this.filter.PolicyBeginUntil=this.policyBeginUntil;
else
  this.filter.PolicyBeginUntil=null;

if(this.policyExpiration!=null)
  this.filter.PolicyExpiration=this.policyExpiration;
else
  this.filter.PolicyExpiration=null;

if(this.policyExpirationUntil!=null)
  this.filter.PolicyExpirationUntil=this.policyExpirationUntil;
else
  this.filter.PolicyExpirationUntil=null;

  this.policyService.CountAll(this.filter).then(p => {
    if (p != null)
      this.totalPolicies = p;
this.policyService.FindAllPolicies(this.filter).then(x=>{if(x!=null)this.policies=x;});

  });

}
  onSelectedInsurance(event) {
    if (isObject(event)) {
      this.selectedInsurance = event;
      this.filter.InsuranceId=this.selectedInsurance.Id;
    }
    else {
      this.selectedInsurance = null;
      this.filter.InsuranceId=null;
    }
  }
  onSelectedPolicyNumber(event) {
    if (isObject(event)) {
      this.selectedPolicyNumber = event;
    }
    else {
      this.selectedPolicyNumber = null;
    }
  }
 onSelectedUser(event){
  if (isObject(event)) {
    this.selectedUser = event;
    this.filter.UserId=this.selectedUser.Id;
  }
  else {
    this.selectedUser = null;
    this.filter.UserId=null;
  }
 }
  addOrEditPolicy(id: string) {
    this.router.navigate(['policies/', id]);
  }
  editPolicyPayments(id:string){
    this.router.navigate([`policies/${id}/payments`])
  }

  removePolicy(event) {
    if (event != null) {

        this.policyService.FindById(event).then(e=>{
          if(e!=null){
            this.policyNumbersService.Delete(e.PolicyNumberId.toString()).toPromise().then(pn=>{
              let i=this.policyNumbers.findIndex((p)=>p.Id==e.PolicyNumberId);
              this.policyNumbers.splice(i,1);
              this.policyService.Delete(event.toString()).toPromise().then(x => {
                let index = this.policies.findIndex((z) => z.Id == event);
                this.policies.splice(index, 1);
                this.notificationService.success("POLICIES", "DELETED_SUCCESSFULY");
               });
            });
          }
        });

    }
  }
  filterData() {
    if (this.selectedInsurance != null) {
      this.table.filter(this.selectedInsurance.Name, "InsuranceName", "contains");
    } else {
      this.table.filter("", "InsuranceName", "contains");
    }

    if (this.selectedPolicyHolder != null) {
      this.table.filter(this.selectedPolicyHolder.FullName, "PolicyHolder", "contains");
    } else {
      this.table.filter("", "PolicyHolder", "contains");
    }

    if (this.selectedPolicyNumber != null) {
      this.table.filter(this.selectedPolicyNumber.Number, "PolicyNumber", "contains");
    }
    else {
      this.table.filter("", "PolicyNumber", "contains");
    }
  }
  stornPolicyNumber(){
    const ref = this.dialogService.open(PolicyNumberStornComponent, {
      header: this.translateService.instant("POLICY_STORN"),
      styleClass: 'popupAgentStorn',
    });
    ref.onClose.subscribe((data : any)=>{
      if(data != undefined){
        let index = this.policyNumbers.find(x=> x.Number == data.Number && x.InsuranceId == data.InsuranceId);
        if(index == undefined){
          this.notificationService.danger("POLICY_NUMBER","POLICY_NUMBER_DOES_NOT_EXIST");
          return;
        }
          this.policyNumbersService.StornPolicyNumber(index).then(x=>{
              if(x != null){
                this.notificationService.success("POLICY_NUMBER","SUCCESSFULLY_STORNED");
              }
          })
      }
    })
  }
  getPolicyHolders(){
this.policyHoldersService.Find().then(x=>{
  if(x != null){
    this.policyHolders = x;
  }
})
  }
  onSelectedPolicyHolder(e){
    if(e == null || e == "")
    return;
    if(isObject(e)){
      this.selectedPolicyHolder = e;
      this.filter.PolicyHolderId = this.selectedPolicyHolder.Id;
    }
    else{
      this.selectedPolicyHolder = null;
      this.filter.PolicyHolderId = null;
    }
  }
}
