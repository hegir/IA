import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { EnumValues } from 'enum-values';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { isObject } from 'util';
import { environment } from '../../../../environments/environment';
import { ArniAutoCompleteComponent } from '../../../autocomplete/autocomplete.component';
import { NotificationsService } from '../../../core/notifications.service';
import { TokenStorage } from '../../../core/tokenstorage.service';
import { OrderType } from '../../../enums/orderType';
import { PolicyNumberStatus, PolicyNumberStatusConstants } from '../../../enums/policyNumberStatus';
import { Insurance } from '../../../models/insuranceCompany';
import { NumberGenerator } from '../../../models/numberGenerator';
import { Policy } from '../../../models/policy';
import { PolicyNumber } from '../../../models/policyNumber';
import { InsuranceCompanyService } from '../../../services/insurance-companies.service';
import { NumbersGeneratorService } from '../../../services/numbers-generator.service';
import { PolicyNumberService } from '../../../services/policy-number.service';
import { DateFormatPipe } from '../../../shared/pipes/dateformat.pipe';
import { PrintReturnedPolicyNumbersComponent } from '../../printPdf/printReturnedPolicyNumbersPdf';

@Component({
  selector: 'app-policy-numbers-agent-returned',
  templateUrl: './policy-numbers-agent-returned.component.html',
  providers: [PolicyNumberService,InsuranceCompanyService,DateFormatPipe,NumbersGeneratorService]
})
export class PolicyNumbersAgentReturnedComponent implements OnInit {
  @ViewChild("insuranceComponent")
  @ViewChild("dt") table : Table;
  CompaniesComponent: ArniAutoCompleteComponent<Insurance>;
  insurances: Insurance[] = new Array();
  selectedInsurance: Insurance = null;
  checks: boolean = false;
  public policyNumberStatus = EnumValues.getNamesAndValues(PolicyNumberStatus);
  returnedTypes : PolicyNumberStatusConstants = new PolicyNumberStatusConstants();
  selectedPolicyNumbers : PolicyNumber[] = new Array();
  filter : any = {};
  SearchText : string;
  totalPolicyNumbers : number;
  selectedStatus : number = -1;
  checkAll : boolean = false;
  policies:Policy[]=new Array();
  totalNumbers:number;
  policyNumbers : PolicyNumber[] = new Array();
  policyNumber: PolicyNumber = new PolicyNumber;
  printPolicyNumbers: PolicyNumber[] = new Array();
  today: Date = new Date()
  agentName: string;
  number: NumberGenerator = new NumberGenerator();
  generatorNumber = new NumberGenerator();
  updatedPolicyNumber : PolicyNumber = new PolicyNumber();
  constructor(
    private tokenStorage : TokenStorage,
    private policyNumbersService : PolicyNumberService,
    private notificationService : NotificationsService,
    private insuranceCompanyService: InsuranceCompanyService,
    private dateFormat : DateFormatPipe,
    private numbersGeneratorService : NumbersGeneratorService) {
    }
  ngOnInit() {
    this.filter.Limit = 10;
    this.filter.Offset = 0;
    this.filter.SortingField = 'Id';
    this.filter.OrderType = OrderType.DESC;
    this.filter.SearchText = null;
    this.filter.Status = -1;
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
  this.policyNumbersService.CountAllReturned(this.filter).then(x => { this.totalPolicyNumbers = x;})
  this.policyNumbersService.FindAllReturned(this.filter).then(y => { this.policyNumbers = y;})
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
  selectAll(event : MatCheckboxChange) {
    if (event.checked) {
      this.policyNumbers.forEach(number => {
        if (number.Status == PolicyNumberStatus.Completed || number.Status == PolicyNumberStatus.Storno  || number.Status == PolicyNumberStatus.Obliged) {
          number.IsReturned = event.checked;
          this.selectedPolicyNumbers.push(number);
        }
      })
    }
    else {
      this.policyNumbers.forEach(number => {
        if (number.Status == PolicyNumberStatus.Completed || number.Status == PolicyNumberStatus.Storno  || number.Status == PolicyNumberStatus.Obliged) {
          number.IsReturned = false;
          let index = this.selectedPolicyNumbers.findIndex(y => y.Id == number.Id);
          this.selectedPolicyNumbers.splice(index, 1);
        }
      })
    }
  }

  activatePolicyNumber(id: string, event: MatCheckboxChange) {
    let policyNumber = this.policyNumbers.find((x) => x.Id == parseInt(id));
    if (event.checked) {
      policyNumber.IsReturned = event.checked;
      this.policyNumbersService.Update(policyNumber).then(x => {
        policyNumber = x;
        this.selectedPolicyNumbers.push(policyNumber);
      })
    }
    else {
      this.policyNumbersService.Update(policyNumber).then(x => {
        policyNumber = x;
        policyNumber.IsReturned = false;
        let index = this.selectedPolicyNumbers.findIndex(y => y.Id == policyNumber.Id);
        this.selectedPolicyNumbers.splice(index, 1);
      })
    }
  }
  activatePolicyNumbers() {
    if (this.selectedPolicyNumbers.length > 0) {
      for (let i = 0; i < this.selectedPolicyNumbers.length; i++) {
        if (this.selectedPolicyNumbers[i].IsReturned) {
          this.selectedPolicyNumbers[i].Status = 5;
          this.policyNumbersService.Update(this.selectedPolicyNumbers[i]).then((p) => {
            if (p != null) {
              this.policyNumber = p;
              this.printPolicyNumbers.push(this.policyNumber);
              let index = this.selectedPolicyNumbers.findIndex(y => y.Id == this.policyNumber.Id)
              this.selectedPolicyNumbers.splice(index, 1);
              this.refreshPolicyNumbers();
              if (this.selectedPolicyNumbers.length == 0) {
                this.notificationService.success("RETURN_POLICY_NUMBERS", "POLICY_NUMBER_SUCCESSFULLY_RETURNED")
              }
            }
          });
        }
      }
    }
    this.checkAll = false;
  }

  pdfTitle: string;
  printReturnedPolicyNumbers() {
    this.agentName = this.tokenStorage.getFullName();
    this.pdfTitle = null;
    this.pdfTitle = "Povrat polisa - " + this.tokenStorage.getFullName() + " " +this.dateFormat.transform(this.today.toString());
    this.numbersGeneratorService.FindLastNumber().then(x=>{
      if(x != null){
        this.number = x;
      }
      this.generatorNumber.Number = this.number.Number + 1;
        this.numbersGeneratorService.Save(this.generatorNumber).then(x=>{
          if(x != null){
            this.generatorNumber = x;
          }
        })
    })

    this.printDocument(this.pdfTitle);
    setTimeout(()=>{
      this.printPolicyNumbers = new Array();
    },500);
  }
  printDocument(pdfTitle : string){
        setTimeout(()=>{
          let htmlDocument = document.getElementById('main').innerHTML;
          new PrintReturnedPolicyNumbersComponent().printDocument(htmlDocument,pdfTitle);
        },100);
  }
}
