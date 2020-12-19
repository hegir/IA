import { Component, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MatDatepicker, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { TranslateService } from '@ngx-translate/core';
import { Workbook, Worksheet } from 'exceljs';
import { Moment } from 'moment';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { isObject } from 'util';
import { environment } from '../../../../environments/environment';
import { ExcelService } from '../../../core/excel.service';
import { PremiumAnalysisReportDto } from '../../../dtos/premiumAnalysisReportDto';
import { OrderType } from '../../../enums/orderType';
import { ExcelData, ExcelHeader, ExcelHeaders } from '../../../models/excelData';
import { InsuranceType } from '../../../models/insuranceTypes';
import { MainOffice } from '../../../models/mainOffice';
import { User } from '../../../models/user';
import { InsuranceTypesService } from '../../../services/insurance-types.service';
import { MainOfficesService } from '../../../services/main-offices.service';
import { ReportsService } from '../../../services/reports.service';
import { UsersService } from '../../../services/users.service';
import { DateFormatPipe } from '../../../shared/pipes/dateformat.pipe';
import { DateTimeFormatPipe } from '../../../shared/pipes/dateTimeFormat.pipe';
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
  selector: 'app-premium-analysis-report',
  templateUrl: './premium-analysis-report.component.html',
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, ReportsService, MainOfficesService, UsersService,DateTimeFormatPipe, InsuranceTypesService,ExcelService,DateFormatPipe]
})

export class PremiumAnalysisReportComponent implements OnInit {
  @ViewChild('dt') table: Table;
  filter: any = {}
  monthFrom: string = (new Date().getMonth() + 1).toString();
  yearFrom: string = (new Date().getFullYear()).toString();
  dateFrom: Date = null;
  monthTo: string = (new Date().getMonth() + 1).toString();
  yearTo: string = (new Date().getFullYear()).toString();
  dateTo: Date = null;
  totalPremiumAnalysis: number = 0;
  premiumAnalysis: PremiumAnalysisReportDto[] = new Array();
  analysis: PremiumAnalysisReportDto = new PremiumAnalysisReportDto;
  mainOffices: MainOffice[] = new Array();
  selectedMainOffice: MainOffice = null;
  agents: User[] = new Array();
  selectedAgent: User = null;
  insuranceTypes: InsuranceType[] = new Array();
  selectedInsuranceType: InsuranceType = new InsuranceType();
  premiumAnalysisAll: PremiumAnalysisReportDto[] = new Array();
  totalPrice: number = 0;
  today : Date = new Date();
   premiumAnalysisExcel : PremiumAnalysisReportDto[] = new Array();
   premiumAnalysisDataExcel : PremiumAnalysisReportDto[] = new Array();
  constructor(private reportsService: ReportsService,
    private mainOfficesService: MainOfficesService,
    private usersService: UsersService,
    private insuranceTypesService: InsuranceTypesService,
    private translateService : TranslateService,
    private excelService : ExcelService,
    private dateTimeFormatPipe: DateTimeFormatPipe,
    private dateFormat : DateFormatPipe) { }

  ngOnInit() {
    this.filter.Limit = 10;
    this.filter.Offset = 0;
    this.filter.SortingField = 'InsuranceName';
    this.filter.OrderType = OrderType.DESC
  }

  loadPremiumAnalysis(event: LazyLoadEvent) {
    if (event.sortField == undefined) {
      this.filter.SortingField = 'MainOfficeName';
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
    this.generateReport();
  }
  generateReport() {
    this.filter.DateFrom = this.dateFrom;
    this.filter.DateTo = this.dateTo;
    this.reportsService.GetPremiumAnalysisReportCount(this.filter).then(x => {
      this.totalPremiumAnalysis = x;
      this.reportsService.GetPremiumAnalysisReport(this.filter).then(y => {
        this.premiumAnalysis = y;
        if (this.totalPremiumAnalysis > 0) {
          this.reportsService.GetPremiumAnalysisReportTotalPrice(this.filter).then(z => { this.totalPrice = z; })
        }
        else
          this.totalPrice = 0;
      })
    })
  }
  refreshAnalysisPremiums() {
    this.table.first = 0;
    this.filter.Offset = this.table.first;
    this.filter.Limit = 10;
    this.generateReport();
  }
  chosenFromMonthHandler(normalizedMonth: Moment, datePicker: MatDatepicker<Moment>) {
    this.monthFrom = normalizedMonth.format('MM');
    this.yearFrom = normalizedMonth.format('YYYY');
    this.dateFrom = new Date(normalizedMonth.format('MM/DD/YYYY'));
    datePicker.close();
  }
  chosenToMonthHandler(normalizedMonth: Moment, datePicker: MatDatepicker<Moment>) {
    this.monthTo = normalizedMonth.format('MM');
    this.yearTo = normalizedMonth.format('YYYY');
    this.dateTo = new Date(normalizedMonth.format('MM/DD/YYYY'));
    this.dateTo.setMonth(this.dateTo.getMonth() + 1);
    this.dateTo.setDate(this.dateTo.getDate() - 1);
    datePicker.close();
  }
  clear(id: string) {
    if (id == "dateFrom") {
      this.dateFrom = null;
      this.monthFrom = null;
      this.yearFrom = null;
    }
    else {
      this.dateTo = null;
      this.monthTo = null;
      this.yearTo = null;
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
  onSelectedAgentChange(e) {
    if (e == null || e == "")
      return;
    if (isObject(e)) {
      this.selectedAgent = e;
      this.filter.UserId = this.selectedAgent.Id;
    }
    else {
      this.selectedAgent = null;
      this.filter.UserId = null;
    }
  }
  getAgents() {
    this.usersService.FindAllAgents().then(x => {
      if (x != null) {
        this.agents = x;
      }
    })
  }
  onSelectedInsuranceType(e) {
    if (e == null || e == "")
      return;
    if (isObject(e)) {
      this.selectedInsuranceType = e;
      this.filter.InsuranceType = this.selectedInsuranceType.Id
    }
    else {
      this.selectedInsuranceType = null;
      this.filter.InsuranceType = null;
    }
  }
  getInsuranceTypes() {
    this.insuranceTypesService.Find().then(y => {
      if (y != null) {
        this.insuranceTypes = y;
      }
    })
  }
getAllPremiumAnalysis(){
this.premiumAnalysisExcel =new Array();
  this.reportsService.GetPremiumAnalysisReportCount(this.filter).then(x=>{
    this.filter.Limit = x;
    this.reportsService.GetPremiumAnalysisReport(this.filter).then(y=>{
      this.premiumAnalysisExcel = y;
      this.generateExcel();
    })
  })
}


  excelData : ExcelData;
  generateExcel() {
    this.excelData = new ExcelData();
    this.excelData.headers = new Array();

    let header : ExcelHeader[] = new Array();

    let h = new ExcelHeader(this.translateService.instant('RB'),1,2,10);
    header.push(h);
    h = new ExcelHeader(this.translateService.instant("AGENT"),1,2,30);
    header.push(h);
    h = new ExcelHeader(this.translateService.instant("MAIN_OFFICE_NAME"),1,2,30);
    header.push(h);
    h = new ExcelHeader(this.translateService.instant("INSURANCE_TYPE_SHORT"),1,2,20);
    header.push(h);
    h = new ExcelHeader(this.translateService.instant("MADE_DATE"),1,2,30);
    header.push(h);
    h = new ExcelHeader(this.translateService.instant("TOTAL_PREMIUM"),1,2,30);
    header.push(h);

    let headers : ExcelHeaders = new ExcelHeaders();
    headers.headers = header;
    this.excelData.headers.push(headers);

    this.premiumAnalysisDataExcel = new Array();

    let index : number = 1;
    this.premiumAnalysisExcel.forEach(premium=>{
      let prem : any = {};
      prem.RB = index;
      if(premium.AgentName != null)
      prem.AgentName = premium.AgentName.toUpperCase();
      else
      prem.AgentName = '-';
      if(premium.MainOfficeName != null)
      prem.MainOfficeName = premium.MainOfficeName.toUpperCase();
      else
      prem.MainOfficeName = '-';
      if(premium.InsuranceTypeLabel != null)
      prem.InsuranceTypeLabel = premium.InsuranceTypeLabel.toUpperCase();
      else
      prem.InsuranceTypeLabel = '-';
      if(premium.Created != null)
      prem.Created = this.dateFormat.transform(premium.Created.toString());
      else
      prem.Created = '-';
      if(premium.TotalPremium != null)
      prem.TotalPremium = premium.TotalPremium.toLocaleString('bs-BA',{style : 'decimal',minimumFractionDigits : 2, maximumFractionDigits : 2});
      else
      prem.TotalPremium = '-';

      this.premiumAnalysisDataExcel.push(prem);
      index++;
    })
    this.excelData.data = this.premiumAnalysisDataExcel;
    if(this.filter.DateFrom == null)
    this.filter.DateFrom = undefined;
    if(this.filter.DateTo == null)
    this.filter.DateTo = undefined;

    this.excelData.headerBackgroundColor = '#b0ea2e';
    this.excelData.worksheetName = this.translateService.instant("PREMIUM_ANALYSIS_REPORT");
    let workbook : Workbook  = this.excelService.createExcelWorkbook(this.excelData);
    let worksheet : Worksheet = workbook.worksheets[0];
    let row = worksheet.addRow(['UKUPNO','','','','',this.totalPrice.toLocaleString('bs-BA',{style : 'decimal',minimumFractionDigits : 2,maximumFractionDigits : 2}) + " KM"]);
    row.worksheet.mergeCells(`A${row.number}:E${row.number}`);
    row.eachCell((cell, number) => {
      cell.font = { bold: true , size : 14 }
      cell.border = { top: { style: 'double' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.alignment = { horizontal: 'right' };
      row.alignment = { indent : 1}
    });
    row.getCell(6).alignment = {horizontal : 'center'};

    this.excelService.saveWorkbook(workbook,
    this.filter.DateFrom != null || this.filter.DateTo != null ?
    this.translateService.instant("PREMIUM_ANALYSIS_REPORT") + ' (' + this.dateFormat.transform(this.filter.DateFrom) + '-' + this.dateFormat.transform(this.filter.DateTo) + ')' :
    this.translateService.instant("PREMIUM_ANALYSIS_REPORT") + ' (' + this.dateFormat.transform(this.today.toString(),"dd.MM.yyyy") + ')'
    );
  }
}
