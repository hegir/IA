import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { EnumValues } from 'enum-values';
import { NgxPermissionsService } from 'ngx-permissions';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { isObject } from 'util';
import { environment } from '../../../../environments/environment';
import { ArniAutoCompleteComponent } from '../../../autocomplete/autocomplete.component';
import { NotificationsService } from '../../../core/notifications.service';
import { TokenStorage } from '../../../core/tokenstorage.service';
import { OrderType } from '../../../enums/orderType';
import { PolicyNumberStatus } from '../../../enums/policyNumberStatus';
import { Insurance } from '../../../models/insuranceCompany';
import { Policy } from '../../../models/policy';
import { PolicyNumber } from '../../../models/policyNumber';
import { InsuranceCompanyService } from '../../../services/insurance-companies.service';
import { PolicyNumberService } from '../../../services/policy-number.service';

@Component({
  selector: 'app-policy-numbers-agent-obligate',
  templateUrl: './policy-numbers-agent-obligate.component.html',
  providers : [PolicyNumberService,InsuranceCompanyService]
})
export class PolicyNumbersAgentObligateComponent implements OnInit {
  @ViewChild("insuranceComponent")
  @ViewChild("dt") table : Table;
  CompaniesComponent: ArniAutoCompleteComponent<Insurance>;
  insurances: Insurance[] = new Array();
  selectedInsurance: Insurance = null;
  checks: boolean = false;
  public policyNumberStatus = EnumValues.getNamesAndValues(PolicyNumberStatus);
  selectedPolicyNumbers : PolicyNumber[] = new Array();
  filter : any = {};
  SearchText : string;
  totalPolicyNumbers : number;
  selectedStatus : number = -1;
  checkAll : boolean = false;
  policies:Policy[]=new Array();
  totalNumbers:number;
  policyNumbers : PolicyNumber[] = new Array();
  policyNumber : PolicyNumber = new PolicyNumber;
  constructor(
    private permissionService : NgxPermissionsService,
    private tokenStorage : TokenStorage,
    private policyNumbersService : PolicyNumberService,
    private notificationService : NotificationsService,
    private insuranceCompanyService: InsuranceCompanyService,

  ) { }

  ngOnInit() {
    this.permissionService.loadPermissions(this.tokenStorage.getUserPermissions());
    this.filter.Limit = 10;
    this.filter.Offset = 0;
    this.filter.SortingField = 'Id';
    this.filter.OrderType = OrderType.DESC;
    this.filter.SearchText = null;
    this.filter.Status = -1;
  }

  activatePolicyNumber(id: string, event: MatCheckboxChange) {
    let policyNumber = this.policyNumbers.find((x) => x.Id == parseInt(id));
    if (event.checked) {
      policyNumber.IsObligate = event.checked;
      this.policyNumbersService.Update(policyNumber).then(x => {
        if (x != null) {
          this.selectedPolicyNumbers.push(policyNumber);
        }
      })
    }
    else {
      policyNumber.IsObligate = false;
      this.policyNumbersService.Update(policyNumber).then(y => {
        if (y != null) {
          let index = this.selectedPolicyNumbers.findIndex(y => y.Id == policyNumber.Id);
          this.selectedPolicyNumbers.splice(index, 1);
        }
      })
    }
  }

  onSelectedChange(e) {
    if(e == "" || e == undefined)
    return;
    if (isObject(e)) {
      this.selectedInsurance = e;
      this.filter.InsuranceId = this.selectedInsurance.Id;
    } else {
      this.selectedInsurance = null;
      this.filter.InsuranceId = null;
    }
  }

  activatePolicyNumbers() {
    if (this.selectedPolicyNumbers.length > 0) {
      for (let i = 0; i < this.selectedPolicyNumbers.length; i++) {
        if (this.selectedPolicyNumbers[i].IsObligate) {
          this.selectedPolicyNumbers[i].Status = 2;
          this.policyNumbersService.Update(this.selectedPolicyNumbers[i]).then((p) => {
            if (p != null) {
              this.policyNumber = p;
              let index = this.selectedPolicyNumbers.findIndex(y => y.Id == this.policyNumber.Id)
              this.selectedPolicyNumbers.splice(index, 1);
              if (this.selectedPolicyNumbers.length == 0) {
                this.notificationService.success("OBLIGATE_POLICY_NUMBERS", "ACTIVATE_POLICY_NUMBERS")
              }
            }
          });
        }
      }
    }
      this.checkAll = false;
  }


  getInsurances(){
    this.insuranceCompanyService.FindAllActive().then(x=>{
      if(x != null){
        this.insurances = x.sort((a,b)=>{
          return (a.Name.localeCompare(b.Name,environment.defaultLanguage))})
        }
    })
  }
  refreshPolicyNumbers(){
   this.table.first = 0;
   this.filter.Offset = this.table.first;
   this.getPolicyNumbers();
  }
  getPolicyNumbers(){
    if (this.SearchText != null)
    this.filter.SearchText = this.SearchText.trim();
  this.policyNumbersService.CountAllDashboard(this.filter).then(x => { this.totalPolicyNumbers = x;})
  this.policyNumbersService.FindAllDashboard(this.filter).then(y => { this.policyNumbers = y;})
  }
  loadPolicyNumbers(event: LazyLoadEvent) {
    if (event.sortField == undefined) {
      this.filter.SortingField = 'Id';
    }
    else {
      this.filter.SortingField = event.sortField;
    }
    if (event.sortOrder == undefined) {
      this.filter.OrderType = OrderType.DESC;
    }
    else {
      this.filter.OrderType = event.sortOrder == -1 ? OrderType.ASC : event.sortOrder;
    }
    this.filter.Limit = event.rows.toString();
    this.filter.Offset = event.first.toString();
    this.getPolicyNumbers();
  }
  selectAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.policyNumbers.forEach(number => {
        if (number.Status == PolicyNumberStatus.Assigned) {
          number.IsObligate = event.checked;
          this.policyNumbersService.Update(number).then(x => {
            if (x != null) {
              this.selectedPolicyNumbers.push(number);
            }
          })
        }
      })
    }
    else {
      this.policyNumbers.forEach(number => {
        if (number.Status == PolicyNumberStatus.Assigned) {
          number.IsObligate = false;
          this.policyNumbersService.Update(number).then(y => {
            if (y != null) {
              let index = this.selectedPolicyNumbers.findIndex(y => y.Id == number.Id);
              this.selectedPolicyNumbers.splice(index, 1);
            }
          })
        }
      })
    }
  }


}
