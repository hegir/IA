import { Component, OnInit, ViewChild } from '@angular/core';
import { RequestService } from '../../../../app/core/request.service';
import { PolicyHolderService } from '../../../services/policy-holder.service';
import { ReportsService } from '../../../services/reports.service';
import { NotificationsService } from '../../../../app/core/notifications.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { isObject, isNullOrUndefined } from 'util';
import { environment } from '../../../../environments/environment';
import { ValidationService } from '../../../../app/core/validation.service';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatPipe } from '../../../shared/pipes/dateformat.pipe';
import { SpecificationsDto } from '../../../dtos/specificationsDto';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatDatepicker, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { Order } from '../../../models/order';
import { ServerSideDto } from '../../../dtos/serverSideDto';
import { LazyLoadEvent } from 'primeng/api';
import { PolicyHolder } from '../../../models/policyHolder';
import { ExcelData, ExcelHeader, ExcelHeaders } from '../../../models/excelData';
import { Workbook } from 'exceljs';
import { Insurance } from '../../../models/insuranceCompany';
import { City } from '../../../models/city';
import { InsuranceCompanyService } from '../../../services/insurance-companies.service';
import { PolicyNumber } from '../../../models/policyNumber';
import { PolicyNumberService } from '../../../services/policy-number.service';
import { OrderType } from '../../../enums/orderType';
import { EnumValues } from 'enum-values';
import { InsuranceTypes } from '../../../enums/insuranceType';
import { ArniAutoCompleteComponent } from '../../../autocomplete/autocomplete.component';
import { ContractedComission } from '../../../models/contractedComission';
import { InsuranceType } from '../../../models/insuranceTypes';
import { InsuranceTypesService } from '../../../services/insurance-types.service';
import { ExcelService } from '../../../core/excel.service';
import { DateTimeFormatPipe } from '../../../shared/pipes/dateTimeFormat.pipe';
import { WorkSheet } from 'xlsx/types';
import { PrintSpecificationComponent } from '../../printPdf/printSpecifiactionPdf';

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
  selector: 'app-specifications-report',
  templateUrl: './specifications.report.component.html',
  providers: [ReportsService,PolicyHolderService, InsuranceCompanyService, PolicyNumberService,DateTimeFormatPipe, NotificationsService, ValidationService, TranslateService, DateFormatPipe,InsuranceTypesService,ExcelService,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true }}]
})
export class SpecificationsReportComponent implements OnInit {

  @ViewChild("insurancesComponent") insurancesComponent: ArniAutoCompleteComponent<Insurance>;
  @ViewChild("policyHoldersComponent") policyHoldersComponent: ArniAutoCompleteComponent<PolicyHolder>;
  @ViewChild("insuranceTypeComponent") insuranceTypeComponent : ArniAutoCompleteComponent<InsuranceType>
  @ViewChild('dt') dt: Table;
  public validationErrors: any = {};
  public InsuranceTypes = EnumValues.getNamesAndValues(InsuranceTypes);
  insurances: Insurance[] = new Array();
  policyHolders: PolicyHolder[] = new Array();
  SearchText : string = null;
  filter : any = {};
  totalSpecifications:number = 0;
  selectedPolicyHolder: PolicyHolder = null;
  selectedInsurance: Insurance = null;
  date: Date = new Date();
  i : number = 0;
  specifications : SpecificationsDto[] = new Array()
  specification : SpecificationsDto =  new SpecificationsDto();
  contractedCommisions : ContractedComission[] = new Array();
  insuranceTypes : InsuranceType[] = new Array();
  selectedInsuranceType : InsuranceType = null;
  excelData : ExcelData;
  today : Date = new Date();
  specificationPrint : SpecificationsDto[] = new Array();
  constructor(private reportsService: ReportsService,
    private policyHolderService: PolicyHolderService,
    private notificationService: NotificationsService,
    private router: Router,
    private insurancesService: InsuranceCompanyService,
    private policyNumberService:PolicyNumberService,
    private translateService: TranslateService,
    private dateTimeFormatPipe: DateTimeFormatPipe,
    private insuranceTypesService : InsuranceTypesService,
    private excelService : ExcelService,
    private dateFormat : DateFormatPipe)
    {
      this.insurancesService.FindAllActive().then(x => {
        if (x != null) {
          this.insurances = x.sort((a, b) => {
            return (a.Name.localeCompare(b.Name, environment.defaultLanguage))
          });
        }
      });
      this.policyHolderService.Find().then(y => {
        if (y != null) {
          this.policyHolders = y.sort((a, b) => {
            return (a.FullName.localeCompare(b.FullName, environment.defaultLanguage))
          })
        }
      });
    }
  ngOnInit() {
    this.filter.Limit = 10;
    this.filter.Offset = 0;
    this.filter.SortingField = 'InsuranceName';
    this.filter.OrderType = OrderType.DESC
    this.filter.SearchText = null;
  }
  refreshSpecifications(){
    this.dt.first = 0;
    this.filter.Offset = this.dt.first;
    this.generateReport();
  }
  details(id: string) {
    this.router.navigate(["specifications", id])}

  findPolicyHolders() {
    if (this.policyHolders.length == 0) {
      this.policyHolderService.Find().then(x => {
        this.policyHolders = x.sort((a, b) => {
          return (a.FullName.localeCompare(b.FullName, environment.defaultLanguage));
        });
      });
    }
  }
  onSelectedInsurance(event) {
    if (isObject(event)) {
      this.selectedInsurance = event;
      this.filter.InsuranceId = this.selectedInsurance.Id;
    }
    else {
      this.selectedInsurance = null;
      this.filter.InsuranceId = null;
    }
  }

loadSpecifications(event : LazyLoadEvent) {
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
    if (this.SearchText != null)
    this.filter.SearchText = this.SearchText.trim();
    this.reportsService.GetSpecificationsReportCount(this.filter).then(x => { this.totalSpecifications = x;})
    this.reportsService.GetSpecificationsReport(this.filter).then(y => { this.specifications = y; })
  }

  chosenFromMonthHandler(datepicker: MatDatepicker<Moment>) {
    this.filter.DateFrom = moment(this.filter.DateFrom).toDate();
    datepicker.close();
  }

  chosenToMonthHandler(datepicker: MatDatepicker<Moment>) {
    this.filter.DateTo = moment(this.filter.DateTo).toDate();
    datepicker.close();
  }

  clear(id: string) {
    if (id == "DateFrom")
      this.filter.DateFrom = null;
    else
      this.filter.DateTo = null;
  }
  sumPolicyPrice() {
    let sumPolicy: number = 0;
    this.specifications.forEach(spec => {
      sumPolicy += spec.Price;
    })
    return sumPolicy;
  }
  sumCarAccidentPrice() {
    let sumCarAccidentPrice: number = 0;
    this.specifications.forEach(spec => {
      sumCarAccidentPrice += spec.CarAccidentCompensation
    })
    return sumCarAccidentPrice;
  }
  sumTotalPremium(){
    let sumTotalPremium : number = 0;
    this.specifications.forEach(spec=>{
      sumTotalPremium += spec.TotalPremium;
    })
    return sumTotalPremium;
  }
  FindContractedCommissions(insuranceId){
    this.insurancesService.FindAllContractedComissions(insuranceId).then(x=>{
      if(x != null){
         this.contractedCommisions = x;
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
  onSelectedInsuranceType(event) {
    if (event == "" || event == null)
      return;
    if (isObject(event)) {
      this.selectedInsuranceType = event;
      this.filter.InsuranceType = this.selectedInsuranceType.Id
    }
    else {
      this.selectedInsuranceType = null;
      this.filter.InsuranceType = null;
    }
  }
  onSelectedPolicyHolder(event){
    if(event == "" || event == null)
    return;

    if(isObject(event)){
      this.selectedPolicyHolder = event;
      this.filter.PolicyHolderId = this.selectedPolicyHolder.Id;
    }
    else{
      this.selectedPolicyHolder = null;
      this.filter.PolicyHolderId = null;
    }
  }
  pdfTitle : string;
  printSpecifications(){
this.pdfTitle = null;
if(this.filter.DateFrom != undefined && this.filter.DateTo != undefined){
  this.pdfTitle = "Specifikacije " + "(" +  this.dateFormat.transform(this.filter.DateFrom) + "-" + this.dateFormat.transform(this.filter.DateTo) + ")";
  this.printDocument(this.pdfTitle);
}
else
this.pdfTitle = "Specifikacije " + "(" + this.dateFormat.transform(this.today.toString()) + ")";
this.printDocument(this.pdfTitle);
  }
  printDocument(pdfTitle : string){
    this.filter.Limit = this.totalSpecifications;
    this.filter.Offset = 0;

    if(this.filter.DateFrom != null)
    this.filter.DateFrom = new Date(this.filter.DateFrom);
    if(this.filter.DateTo != null)
    this.filter.DateTo = new Date(this.filter.DateTo);

    this.specificationPrint = new Array();

    this.reportsService.GetSpecificationsReportCount(this.filter).then(x=>{
      this.filter.Limit =x;
      this.reportsService.GetSpecificationsReport(this.filter).then(y=>{
        this.specificationPrint = y;
        setTimeout(()=>{
          let htmlDocument = document.getElementById('main').innerHTML;
          new PrintSpecificationComponent().printDocument(htmlDocument,pdfTitle);
        },100);
      })
    })
  }

  generateExcel(){
    this.excelData = new ExcelData();
    this.excelData.headers = new Array();

    this.excelData.title2 = ('Zastupnik: AG Insurance,Sarajevo');
    this.excelData.title = 'Period:' + ' ' + this.dateFormat.transform(this.filter.DateFrom) + '-' + this.dateFormat.transform(this.filter.DateTo);
    let header : ExcelHeader[] = new Array();

    let h = new ExcelHeader(this.translateService.instant('RB'),1,2,10);
    header.push(h);
    h = new ExcelHeader(this.translateService.instant('INSURANCE_NAME'),1,2,30);
    header.push(h);
    h = new ExcelHeader(this.translateService.instant('VRO'),1,2,15);
    header.push(h);
    h = new ExcelHeader(this.translateService.instant('ISSUE_DATE'),1,2,20);
    header.push(h);
    h = new ExcelHeader(this.translateService.instant('POLICY_NUMBER'),1,2,20);
    header.push(h);
    h = new ExcelHeader(this.translateService.instant('POLICY_HOLDER_NAME'),1,2,30);
    header.push(h);
    h = new ExcelHeader(this.translateService.instant('POLICY_PRICE'),1,2,20);
    header.push(h);
    h = new ExcelHeader(this.translateService.instant('CAR_ACCIDENT'),1,2,20);
    header.push(h);
    h = new ExcelHeader(this.translateService.instant('TOTAL_PREMIUM'),1,2,20);
    header.push(h);

    let headers : ExcelHeaders = new ExcelHeaders();
    headers.headers = header;
    this.excelData.headers.push(headers);

    let specificationsExcel : SpecificationsDto[] = new Array();
let index : number = 1;
this.specifications.forEach(specification=>{
  let spec: any = {};
  spec.RB = index;
  if (specification.InsuranceName != null)
    spec.InsuranceName = specification.InsuranceName.toUpperCase();
  else
    spec.InsuranceName = '-';
  if (specification.InsuranceType != null)
    spec.InsuranceType = specification.InsuranceType.toUpperCase();
  else
    spec.InsuranceType = '-';
  if (specification.Created != null)
    spec.Created = specification.Created;
  else
    spec.Created = '-';
  if (specification.Number != null)
    spec.Number = specification.Number.toUpperCase();
  else
    spec.Number = '-';
  if (specification.PolicyHolderName != null)
    spec.PolicyHolderName = specification.PolicyHolderName.toUpperCase();
  else
    spec.PolicyHolderName = '-';
  if (specification.Price != null)
    spec.Price = specification.Price;
  else
    spec.Price = '-';
  if (specification.CarAccidentCompensation != null)
    spec.CarAccidentCompensation = specification.CarAccidentCompensation;
  else
    spec.CarAccidentCompensation = '-';
  if (specification.TotalPremium != null)
    spec.TotalPremium = specification.TotalPremium;
  else
    spec.TotalPremium = '-';

  specificationsExcel.push(spec);
  index++;
})
if(this.filter.DateFrom == null)
this.filter.DateFrom = undefined;
if(this.filter.DateTo == null)
this.filter.DateTo = undefined;
this.excelData.data = specificationsExcel;
this.excelData.headerBackgroundColor = '#b0ea2e';
this.excelData.worksheetName = this.translateService.instant('REPORTS_SPECIFICATIONS');
let workbook : Workbook = this.excelService.createExcelWorkbook(this.excelData);
let worksheet : WorkSheet = workbook.worksheets[0];
let row = worksheet.addRow(['UKUPNO','','','','','',this.sumPolicyPrice(),this.sumCarAccidentPrice(),this.sumTotalPremium()]);
row.worksheet.mergeCells(`A${row.number}:F${row.number}`);
row.eachCell((cell, number) => {
  cell.font = { bold: true , size : 14 }
  cell.border = { top: { style: 'double' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  row.alignment = { horizontal: 'right' };
  row.alignment = { indent : 1}
});
row.getCell(7).alignment = {horizontal : 'center' };
row.getCell(8).alignment = {horizontal : 'center' };
row.getCell(9).alignment = {horizontal : 'center' };

this.excelService.saveWorkbook(workbook,
  this.filter.DateFrom != null || this.filter.DateTo != null ?
  this.translateService.instant('SPECIFICATIONS') + ' (' + this.dateFormat.transform(this.filter.DateFrom)
+ '-' + this.dateFormat.transform(this.filter.DateTo) + ')' : this.translateService.instant('SPECIFICATIONS') + ' (' + this.dateFormat.transform(this.today.toString(),"dd.MM.yyyy") + ')');
  }
}
