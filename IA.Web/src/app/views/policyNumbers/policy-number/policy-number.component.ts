import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { parse } from 'querystring';
import { isObject } from 'util';
import { ArniAutoCompleteComponent } from '../../../autocomplete/autocomplete.component';
import { NotificationsService } from '../../../core/notifications.service';
import { DeleteConfirmationDirective } from '../../../directives/delete.confirmation.directive';
import { Insurance } from '../../../models/insuranceCompany';
import { PolicyNumber } from '../../../models/policyNumber';
import { InsuranceCompanyService } from '../../../services/insurance-companies.service';
import { PolicyNumberService } from '../../../services/policy-number.service';
import { environment } from '../../../../environments/environment';
import { PolicyNumberStatus } from '../../../enums/policyNumberStatus';
import { EnumValues } from 'enum-values';
import { OrderType } from '../../../enums/orderType';
import { LazyLoadEvent } from 'primeng/api';
import { User } from '../../../models/user';
import { UsersService } from '../../../services/users.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-policy-number',
  templateUrl: './policy-number.component.html',
  providers: [PolicyNumberService,InsuranceCompanyService,DeleteConfirmationDirective,UsersService]
})
export class PolicyNumberComponent implements OnInit {
  @ViewChild("dt") table : Table;
policyNumbers:PolicyNumber[]=new Array();
policyNumber:PolicyNumber=new PolicyNumber();
@ViewChild("insuranceComponent") CompaniesComponent: ArniAutoCompleteComponent<Insurance>;
@ViewChild("usersComponent") usersComponent: ArniAutoCompleteComponent<User>;

insurances: Insurance[] = new Array();
selectedInsurance:Insurance=null;
filter : any = {};
SearchText : string;
totalPolicyNumbers : number;
FilteredInsuranceName : string;
FilteredPolicyNumber:string=null;
public policyNumberStatus = EnumValues.getNamesAndValues(PolicyNumberStatus);
agents : User[] = new Array();
selectedAgent : User = null;


  constructor(private policyNumberService: PolicyNumberService,private insuranceCompanyService:InsuranceCompanyService,
    private router: Router,
    private notificationService: NotificationsService,private translateService:TranslateService,
    public deleteDirective:DeleteConfirmationDirective,
    private usersService : UsersService) {
     }

  ngOnInit() {
    this.filter.Limit = 10;
    this.filter.Offset = 0;
    this.filter.SortingField = 'Added';
    this.filter.OrderType = OrderType.DESC;
    this.filter.SearchText = null;
    this.filter.Status = -1;
  }
  addOrEditPolicyNumber(id: string) {
    this.router.navigate(['policynumbers/', id]);
  }
  refreshPolicyNumbers(){
    this.filter.Offset = this.table.first = 0;
    this.getPolicyNumbers();
  }
  getPolicyNumbers(){
    if (this.SearchText != null)
      this.filter.SearchText = this.SearchText.trim();
    this.policyNumberService.CountAll(this.filter).then(x => { this.totalPolicyNumbers = x; })

    this.policyNumberService.FindAll(this.filter).then(y => { this.policyNumbers = y;})
  }
getInsurances(){
  this.insuranceCompanyService.FindAllActive().then(x=>{
    if(x != null){
      this.insurances = x.sort((a,b)=>{
        return (a.Name.localeCompare(b.Name,environment.defaultLanguage));
      })
    }
  })
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
  onDelete(event) {
    if (event != null) {
      this.policyNumberService.Delete(event).toPromise().then(x => {
        let index = this.policyNumbers.findIndex(z => z.Id == event);
        this.policyNumbers.splice(index, 1);
        this.notificationService.success("POLICY_NUMBERS", "DELETED_SUCCESSFULY");
      });
    }
  }
  onSelectedChange(e){
    if(e==null || e=="")
    return;
    if(isObject(e)){
      this.selectedInsurance=e;
      this.filter.InsuranceId = this.selectedInsurance.Id;
    }else{
      this.selectedInsurance=null;
      this.filter.InsuranceId = null;
    }
  }
  activatePolicyNumber(id:string,event:MatCheckboxChange){
    let policyNumber = this.policyNumbers.find(x => x.Id == parseInt(id));
      if(policyNumber != null){
        this.policyNumberService.Update(policyNumber).then(y=>{
          if(y!=null){
            this.policyNumber=y;
            this.notificationService.success("POLICY_NUMBERS", "UPDATED_SUCCESSFULY");
          }
        });
      }
  }
  getAgents(){
    this.usersService.FindAllAssignedAgents().then(x=>{
      if(x != null){
        this.agents = x;
      }
    })
  }
  onSelectedAgentChange(event){
    if(event==null || event=="")
    return;
    if(isObject(event)){
      this.selectedAgent=event;
      this.filter.AssignedTo = this.selectedAgent.Id;
    }else{
      this.selectedAgent=null;
      this.filter.AssignedTo = null;
    }
  }

}
