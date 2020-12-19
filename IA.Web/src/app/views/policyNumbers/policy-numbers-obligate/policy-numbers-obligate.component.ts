import { Component, OnInit, ViewChild } from '@angular/core';
import { PolicyNumberService } from '../../../services/policy-number.service';
import { PolicyNumber } from '../../../models/policyNumber';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../models/user';
import { DialogService, LazyLoadEvent } from 'primeng/api';
import { AgentsSearchComponent } from '../../users/agentsSearchDialog/agents-search/agents-search.component';
import { TokenStorage } from '../../../core/tokenstorage.service';
import { NotificationsService } from '../../../core/notifications.service';
import { PolicyNumberStatus } from '../../../enums/policyNumberStatus';
import { EnumValues } from 'enum-values';
import { camelCase } from 'jquery';
import { ArniAutoCompleteComponent } from '../../../autocomplete/autocomplete.component';
import { Insurance } from '../../../models/insuranceCompany';
import { InsuranceCompanyService } from '../../../services/insurance-companies.service';
import { isObject } from 'util';
import { OrderType } from '../../../enums/orderType';
import { UsersService } from '../../../services/users.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-policy-numbers-obligate',
  templateUrl: './policy-numbers-obligate.component.html',
  providers : [PolicyNumberService,DialogService,InsuranceCompanyService,UsersService]
})
export class PolicyNumbersObligateComponent implements OnInit {
@ViewChild("dt") table : Table;
policyNumbers : PolicyNumber[] = new Array();
selectedPolicyNumbers : PolicyNumber[] = new Array();
assignOptions : any = new Array();
users : User[] = new Array();
public policyNumberStatus = EnumValues.getNamesAndValues(PolicyNumberStatus);
@ViewChild("insuranceComponent") insuranceComponent : ArniAutoCompleteComponent<Insurance>;
insurances : Insurance[] = new Array();
selectedInsurance : Insurance = null;
filter : any = {};
SearchText: string;
totalPolicyNumbers : number;
agents : User[] = new Array();
selectedAgent : User = null;
showCreated : boolean = false;
  constructor(private policyNumbersService : PolicyNumberService,
              private translateService : TranslateService,
              private dialogService :DialogService,
              private tokenStorage : TokenStorage,
              private notificationService : NotificationsService,
              private insurancesService : InsuranceCompanyService,
              private usersService : UsersService) {
    this.assignOptions.push({label: this.translateService.instant("ASSIGN"), icon : 'pi pi-angle-double-down',command: (event) => this.assignPolicyNumber(this.selectedPolicyNumbers) })
  }

  ngOnInit() {
    this.filter.Limit = 10;
    this.filter.Offset = 0;
    this.filter.SortingField = 'Id';
    this.filter.OrderType = OrderType.DESC;
    this.filter.SearchText = null;
    this.filter.Status = -1;
  }
  refreshPolicyNumbers() {
    this.table.first = 0;
    this.filter.Offset = this.table.first;
    if(this.filter.Status == 0){
      this.showCreated = true;
    }
    else{
      this.showCreated = false;
    }
    this.getPolicyNumbers();
  }

  assignPolicyNumber(selectedPolicyNumbers: PolicyNumber[]) {
    const ref = this.dialogService.open(AgentsSearchComponent, {
      header: this.translateService.instant("SELECT_AGENT"),
      styleClass: 'popupAgent'
    });

    ref.onClose.subscribe((users: any) => {
      if (users) {
        let userPolicyNumberModel: any = {
          AssignTo: users.assignTo
        }
        let policyNumbers: number[] = new Array();
        selectedPolicyNumbers.forEach(selectedPolicyNumber => {
          policyNumbers.push(selectedPolicyNumber.Id);
        })
        userPolicyNumberModel.PolicyNumbers = policyNumbers;
        userPolicyNumberModel.UpdatedBy = parseInt(this.tokenStorage.getUserId());
        userPolicyNumberModel.Status = PolicyNumberStatus.Assigned;
      this.policyNumbersService.Assign(userPolicyNumberModel).then(x=>{
        if(x){
          this.notificationService.success("OBLIGATE_POLICY_NUMBERS","SUCCESSFULLY_ASSIGNED");
          this.getPolicyNumbers();
          this.selectedPolicyNumbers = new Array();
        }
      })
      }
    })

}
  isPolicyNumberSelected(policyNumber : PolicyNumber){
    if(this.selectedPolicyNumbers != null){
      let existingPolicyNumber = this.selectedPolicyNumbers.find(x=> x.Id == policyNumber.Id);
      if(existingPolicyNumber != null)
      return true;
    }
    return false;
  }
  getPolicyNumbers(){
    if (this.SearchText != null)
    this.filter.SearchText = this.SearchText.trim();
  this.policyNumbersService.CountAll(this.filter).then(x => { this.totalPolicyNumbers = x;})
  this.policyNumbersService.FindAll(this.filter).then(y => { this.policyNumbers = y; })
  }

  contextMenuSelected(event){
    this.assignOptions[0].disabled = false;
    let canAssign = false;
    this.selectedPolicyNumbers.forEach(selectedPolicyNumber =>{
      if(selectedPolicyNumber.Status == PolicyNumberStatus.Created)
      canAssign = true;
      if(selectedPolicyNumber.Status == PolicyNumberStatus.Assigned)
      canAssign = false;
    })
    if(!canAssign){
      this.assignOptions[0].disabled = true;
    }
  }
  getInsurances(){
    this.insurancesService.FindAllActive().then(x=>{
      if(x != null){
        this.insurances = x.sort((a,b)=>{
          return (a.Name.localeCompare(b.Name,environment.defaultLanguage))})
        }
    })
  }
  onSelectedChange(event) {
    if(event == null || event =="")
    return;
    if (isObject(event)) {
      this.selectedInsurance = event;
      this.filter.InsuranceId = this.selectedInsurance.Id;
    }
    else {
      this.selectedInsurance = null;
      this.filter.InsuranceId = null;
    }
  }

  loadPolicyNumbers(event : LazyLoadEvent){
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
this.getPolicyNumbers();
  }
  getAgents(){
    this.usersService.FindAllAssignedAgents().then(x=>{
      if(x != null){
        this.agents = x;
      }
    })
  }
  onSelectedAgentChange(event){
    if(event == null || event =="")
    return;
    if(isObject(event)){
      this.selectedAgent = event;
      this.filter.AssignedTo = this.selectedAgent.Id;
    }
    else{
      this.selectedAgent = null;
      this.filter.AssignedTo = null;
    }
  }
}
