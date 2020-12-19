import { Component, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MatDatepicker, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { isObject } from 'util';
import { environment } from '../../../../environments/environment';
import { SkadencaReportDto } from '../../../dtos/skadencaReportDto';
import { OrderType } from '../../../enums/orderType';
import { Insurance } from '../../../models/insuranceCompany';
import { MainOffice } from '../../../models/mainOffice';
import { PolicyHolder } from '../../../models/policyHolder';
import { InsuranceCompanyService } from '../../../services/insurance-companies.service';
import { MainOfficesService } from '../../../services/main-offices.service';
import { PolicyHolderService } from '../../../services/policy-holder.service';
import { ReportsService } from '../../../services/reports.service';


export const MY_FORMATS = {
  parse: {
    dateInput: 'MM.YYYY.',
  },
  display: {
    dateInput: 'MM.YYYY.',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-skadenca-report',
  templateUrl: './skadenca-report.component.html',
  providers : [ReportsService,{ provide: DateAdapter, useClass: MomentDateAdapter },
     { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },InsuranceCompanyService,MainOfficesService,PolicyHolderService]
})
export class SkadencaReportComponent implements OnInit {
@ViewChild('dt') table : Table;
filter : any = {};
SearchText : string = null;
totalSkadenca : number = 0;
skadencas : SkadencaReportDto[] = new Array();
skadenca : SkadencaReportDto = new SkadencaReportDto();
monthFrom : string = (new Date().getMonth() + 1).toString();
yearFrom : string = (new Date().getFullYear()).toString();
dateFrom : Date = null;
monthTo : string = (new Date().getMonth() +1).toString();
yearTo : string = (new Date().getFullYear()).toString();
dateTo : Date = null;
insurances : Insurance[] =  new Array();
selectedInsurance : Insurance = null;
mainOffices : MainOffice[] = new Array()
selectedMainOffice : MainOffice = null;
policyHolders : PolicyHolder[] = new Array();
selectedPolicyHolder : PolicyHolder = null;
  constructor(private reportsService : ReportsService,
    private insuracesService : InsuranceCompanyService,
    private mainOfficesService : MainOfficesService,
    private policyHoldersService : PolicyHolderService) { }

  ngOnInit() {
    this.filter.Limit = 10;
    this.filter.Offset = 0;
    this.filter.SortingField = 'InsuranceName';
    this.filter.OrderType = OrderType.DESC
    this.filter.SearchText = null;
  }
  loadSkadencas(event : LazyLoadEvent) {
    if(event.sortField == undefined) {
      this.filter.SortingField='Id';
    }
    else {
    this.filter.SortingField=event.sortField;
    }
    if(event.sortOrder == undefined)
     {this.filter.OrderType=OrderType.DESC;
     }
     else {
       this.filter.OrderType=event.sortOrder== -1 ? OrderType.ASC : event.sortOrder;
     }
    this.filter.Limit=event.rows.toString();
    this.filter.Offset= event.first.toString();
    this.generateReport();
    }
    generateReport() {
      this.filter.DateFrom = this.dateFrom;
      this.filter.DateTo = this.dateTo;
      if (this.SearchText != null)
      this.filter.SearchText = this.SearchText.trim();
      this.reportsService.GetSkadencaReportCount(this.filter).then(x => { this.totalSkadenca = x;})
      this.reportsService.GetSkadencaReport(this.filter).then(y => { this.skadencas = y;})
    }
    refreshSkadenca(){
       this.table.first = 0;
       this.filter.Offset = this.table.first;
       this.generateReport();
    }
    chosenFromMonthHandler(normalizedMonth: Moment,datePicker : MatDatepicker<Moment>){
       this.monthFrom = normalizedMonth.format('MM');
       this.yearFrom = normalizedMonth.format('YYYY');
       this.dateFrom = new Date(normalizedMonth.format('MM/DD/YYYY'));
       datePicker.close();
    }
    chosenToMonthHandler(normalizedMonth : Moment,datePicker : MatDatepicker<Moment>){
      this.monthTo = normalizedMonth.format('MM');
      this.yearTo = normalizedMonth.format('YYYY');
      this.dateTo = new Date(normalizedMonth.format('MM/DD/YYYY'));
      this.dateTo.setMonth(this.dateTo.getMonth() + 1);
      this.dateTo.setDate(this.dateTo.getDate() - 1);
      datePicker.close();
    }
    clear(id: string) {
      if (id == "dateFrom")
      {
        this.dateFrom = null;
  this.monthFrom = null;
  this.yearFrom = null;
      }
      else
      {
        this.dateTo = null;
        this.monthTo = null;
        this.yearTo = null;
      }
    }
  getInsurances() {
    this.insuracesService.FindAllActive().then(x => {
      if (x != null) {
        this.insurances = x.sort((a, b) => {
          return a.Name.localeCompare(b.Name, environment.defaultLanguage);
        });
      }
    })
  }
  onSelectedInsuranceChange(e) {
    if (e == null || e == "")
      return;
    if (isObject(e)) {
      this.selectedInsurance = e;
      this.filter.InsuranceId = this.selectedInsurance.Id;
    }
    else {
      this.selectedInsurance = null;
      this.filter.InsuranceId = null;
    }
  }
  getMainOffices() {
    this.mainOfficesService.FindAllActive().then(x => {
      if (x != null) {
        this.mainOffices = x.sort((a, b) => {
          return a.Name.localeCompare(b.Name, environment.defaultLanguage);
        })
      }
    })
  }
  onSelectedMainOfficeChange(e) {
    if (e == null || e == "")
      return;
    if (isObject(e)) {
      this.selectedMainOffice = e;
      this.filter.MainOfficeId = this.selectedMainOffice.Id;
    }
    else {
      this.selectedMainOffice = null;
      this.filter.MainOfficeId = null;
    }
  }
  getPolicyHolders() {
    this.policyHoldersService.Find().then(x => {
      this.policyHolders = x.sort((a, b) => {
        return a.FullName.localeCompare(b.FullName, environment.defaultLanguage);
      })
    })
  }
  onSelectedPolicyHolderChange(e){
    if(e==null || e=="")
    return;
    if(isObject(e)){
      this.selectedPolicyHolder = e;
      this.filter.PolicyHolderId = this.selectedPolicyHolder.Id
    }
    else{
      this.selectedPolicyHolder = null;
      this.filter.PolicyHolderId = null;
    }
  }
}
