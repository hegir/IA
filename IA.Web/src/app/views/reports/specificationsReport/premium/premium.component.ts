import { Component, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MatDatepicker, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { EnumValues } from 'enum-values';
import { LazyLoadEvent } from 'primeng/api';
import { isObject } from 'util';
import { environment } from '../../../../../environments/environment';
import { ArniAutoCompleteComponent } from '../../../../autocomplete/autocomplete.component';
import { PremiumReportDto } from '../../../../dtos/premiumReport';
import { InsuranceTypes } from '../../../../enums/insuranceType';
import { OrderType } from '../../../../enums/orderType';
import { Insurance } from '../../../../models/insuranceCompany';
import { MainOffice } from '../../../../models/mainOffice';
import { PolicyHolder } from '../../../../models/policyHolder';
import { InsuranceCompanyService } from '../../../../services/insurance-companies.service';
import { MainOfficesService } from '../../../../services/main-offices.service';
import { PolicyHolderService } from '../../../../services/policy-holder.service';
import { ReportsService } from '../../../../services/reports.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter'
import * as moment from 'moment';
import { Moment } from 'moment';
import { PremiumReportDetail } from '../../../../dtos/premiumReportDetail';
import { ExcelData, ExcelHeader, ExcelHeaders } from '../../../../models/excelData';
import { TranslateService } from '@ngx-translate/core';
import { Workbook } from 'exceljs';
import { ExcelService } from '../../../../core/excel.service';
import { DateTimeFormatPipe } from '../../../../shared/pipes/dateTimeFormat.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/dateformat.pipe';
import { InsuranceTypesService } from '../../../../services/insurance-types.service';
import { InsuranceType } from '../../../../models/insuranceTypes';
import { Table } from 'primeng/table';
import { VehicleType } from '../../../../enums/vehicleType';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM.YYYY.',
  },
  display: {
    dateInput: 'DD.MM.YYYY.',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-premium',
  templateUrl: './premium.component.html',
  providers : [ReportsService,InsuranceCompanyService,PolicyHolderService,MainOfficesService,ExcelService,DateTimeFormatPipe,DateFormatPipe,InsuranceTypesService,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true },
    }]
})
export class PremiumComponent implements OnInit {
  @ViewChild("insuranceComponent")insuranceComponent : ArniAutoCompleteComponent<Insurance>
  @ViewChild("policyHolderComponent") policyHolderComponent : ArniAutoCompleteComponent<PolicyHolder>
  @ViewChild("mainOfficeComponent") mainOfficeComponent : ArniAutoCompleteComponent<MainOffice>
  @ViewChild("dt") table : Table;
  filter : any = {};
  SearchText : string;
  premiums : PremiumReportDto[] = new Array();
  premium : PremiumReportDto = new PremiumReportDto();
  totalPremiums : number;
  public InsuranceTypes = EnumValues.getNamesAndValues(InsuranceTypes);
  insurances : Insurance[] = new Array;
  selectedInsurance : Insurance = null;
  policyHolders : PolicyHolder[] = new Array;
  selectedPolicyHolder : PolicyHolder = null;
  mainOffices : MainOffice[] = new Array();
  selectedMainOffice: MainOffice = null;
  premiumsExpanded : PremiumReportDetail  = new PremiumReportDetail();
  public vehicleType = EnumValues.getNamesAndValues(VehicleType);
  excelData : ExcelData;
  today: Date = new Date();
  insuranceTypes : InsuranceType[] = new Array();
  selectedInsuranceType : InsuranceType = null;
  constructor(
    private reportsService : ReportsService,
    private insuranceCompanyService : InsuranceCompanyService,
    private policyHoldersService : PolicyHolderService,
    private mainOfficesService : MainOfficesService,
    private translateService : TranslateService,
    private excelService : ExcelService,
    private dateTimeFormatPipe: DateTimeFormatPipe,
    private dateFormat : DateFormatPipe,
    private insuranceTypesService : InsuranceTypesService
  )
   {
    }

  ngOnInit() {
    this.filter.Limit = 10;
    this.filter.Offset = 0;
    this.filter.SortingField = 'MainOfficeName';
    this.filter.OrderType = OrderType.DESC
    this.filter.SearchText = null;
  }
  refreshPremiums(){
    this.table.first = 0;
    this.filter.Offset = this.table.first;
    this.getPremiums();
  }

  chosenFromMonthHandler(datepicker: MatDatepicker<Moment>) {
    this.filter.DateFrom = moment(this.filter.DateFrom).toDate();
    datepicker.close();
  }

  chosenToMonthHandler(datepicker: MatDatepicker<Moment>) {
    this.filter.DateTo = moment(this.filter.DateTo).toDate();
    datepicker.close();
  }

  getPremiums(){
    if (this.SearchText != null)
    this.filter.SearchText = this.SearchText.trim();
    this.reportsService.GetPremiumReport(this.filter).then(x=>{
      if(x != null){
        this.premiums = x;
      }
    })
    this.reportsService.GetPremiumReportCount(this.filter).then(y=>{
      if(y != null){
        this.totalPremiums = y;
      }
    })
  }

  loadPremiums(event : LazyLoadEvent){
    if(event.sortField == undefined){
      this.filter.SortingField = 'MainOfficeName';
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
    this.getPremiums();
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
  onSelectedInsuranceChange(e){
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
  getPolicyHolders(){
    this.policyHoldersService.Find().then(p=>{
      if(p != null){
        this.policyHolders = p;
      }
    })
  }
  onSelectedPolicyHolderChange(e){
    if(e==null || e=="")
    return;
    if(isObject(e)){
      this.selectedPolicyHolder=e;
      this.filter.PolicyHolderId = this.selectedPolicyHolder.Id;
    }else{
      this.selectedPolicyHolder=null;
      this.filter.PolicyHolderId = null;
    }
  }
  clear(id: string) {
    if (id == "DateFrom")
      this.filter.DateFrom = null;
    else
      this.filter.DateTo = null;
  }
  getMainOffices(){
this.mainOfficesService.FindAllActive().then(m=>{
  if(m!=null){
    this.mainOffices = m;
  }
})
  }
  onSelectedMainOfficeChange(event){
    if(event =="" || event == null)
    return;
    if(isObject(event)){
      this.selectedMainOffice = event;
      this.filter.MainOfficeId = this.selectedMainOffice.Id;
    }
    else{
      this.selectedMainOffice = null;
      this.filter.MainOfficeId = null;
    }
  }
  rowExpand(event){
    this.reportsService.GetPremiumReportDetails(event.data.PolicyId).then(x=>{
      if(x != null){
        this.premiumsExpanded = x;
      }
    })
  }
  getInsuranceTypes(){
this.insuranceTypesService.Find().then(x=>{
  if(x != null){
this.insuranceTypes = x.sort((a,b)=>{
  return (a.Label.localeCompare(b.Label,environment.defaultLanguage));
});
  }
})
  }
  onSelectedInsuranceType(event){
    if(event == "" || event== null)
    return;
    if(isObject(event)){
      this.selectedInsuranceType = event;
      this.filter.InsuranceType = this.selectedInsuranceType.Id
    }
    else{
      this.selectedInsuranceType = null;
      this.filter.InsuranceType = null;
    }
  }
  generateExcel(){
this.excelData = new ExcelData();
this.excelData.headers = new Array();

let header : ExcelHeader[] = new Array();

let h = new ExcelHeader(this.translateService.instant('RB'),1,2,10,);
header.push(h);
h = new ExcelHeader(this.translateService.instant('MAIN_OFFICE'),1,2,30);
header.push(h);
h = new ExcelHeader(this.translateService.instant('INSURANCE_NAME'),1,2,30)
header.push(h);
h = new ExcelHeader(this.translateService.instant('DATE_OF_EXPIRATION'),1,2,30)
header.push(h);
h = new ExcelHeader(this.translateService.instant('INSURANCE_TYPE'),1,2,30)
header.push(h);
h = new ExcelHeader(this.translateService.instant('CREATED_DATE'),1,2,30)
header.push(h);
h = new ExcelHeader(this.translateService.instant('POLICY_NUMBER'),1,2,30)
header.push(h);
h = new ExcelHeader(this.translateService.instant('POLICY_HOLDER_INFO'),1,2,30)
header.push(h);
h = new ExcelHeader(this.translateService.instant('POLICY_PRICE'),1,2,30)
header.push(h);
h = new ExcelHeader(this.translateService.instant('CAR_ACCIDENT_COMPENSATION'),1,2,40)
header.push(h);
h = new ExcelHeader(this.translateService.instant('TOTAL'),1,2,30)
header.push(h);

let headers : ExcelHeaders = new ExcelHeaders();
headers.headers = header;
this.excelData.headers.push(headers);

let premiumsExcel : PremiumReportDto[] = new Array();
let index : number = 1.;
this.premiums.forEach(premium=>{
  let prem: any = {};
  prem.RB = index;
  if (premium.MainOfficeName != null)
    prem.MainOfficeName = premium.MainOfficeName.toUpperCase();
  else
    prem.MainOfficeName = '-';
  if (premium.InsuranceName != null)
    prem.InsuranceName = premium.InsuranceName.toUpperCase();
  else
    prem.InsuranceName = '-';
  if (premium.PolicyExpiration != null)
    prem.PolicyExpiration = premium.PolicyExpiration;
  else
    prem.PolicyExpiration = '-';
  if (premium.InsuranceType != null)
    prem.InsuranceType = premium.InsuranceType.toUpperCase();
  else
    prem.InsuranceType = '-';
  if (premium.Created != null)
    prem.Created = premium.Created;
  else
    prem.Created = '-';
  if (premium.Number != null)
    prem.Number = premium.Number.toUpperCase();
  else
    prem.Number = '-';
  if (premium.PolicyHolderFullName != null)
    prem.PolicyHolderFullName = premium.PolicyHolderFullName.toUpperCase();
  else
    prem.PolicyHolderFullName = '-';
  if (premium.Price != null)
    prem.Price = premium.Price;
  else
    prem.Price = '-';
  if (premium.CarAccidentCompensation != null)
    prem.CarAccidentCompensation = premium.CarAccidentCompensation;
  else
    prem.CarAccidentCompensation = '-';
  if (premium.Total != null)
    prem.Total = premium.Total;
  else
    prem.Total = '-';
premiumsExcel.push(prem);
index++;
})
if(this.filter.DateFrom == null)
this.filter.DateFrom = undefined;
if(this.filter.DateTo == null)
this.filter.DateTo = undefined;
this.excelData.data = premiumsExcel;
this.excelData.headerBackgroundColor = '#b0ea2e';
this.excelData.worksheetName = this.translateService.instant('PREMIUM');
let workbook: Workbook = this.excelService.createExcelWorkbook(this.excelData);
this.excelService.saveWorkbook(workbook,
  this.filter.DateFrom != null && this.filter.DateTo != null ?
  this.translateService.instant('PREMIUM') +' (' + this.dateFormat.transform(this.filter.DateFrom)
+ '-' + this.dateFormat.transform(this.filter.DateTo) + ')' : this.translateService.instant('PREMIUM') + ' ' + this.dateFormat.transform(this.today.toString(),"dd.MM.yyyy"));
}
}
