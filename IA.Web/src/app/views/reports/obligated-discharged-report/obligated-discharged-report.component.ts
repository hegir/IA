import { Component, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MatDatepicker, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import { isObject } from 'util';
import { environment } from '../../../../environments/environment';
import { Insurance } from '../../../models/insuranceCompany';
import { InsuranceCompanyService } from '../../../services/insurance-companies.service';
import * as moment from 'moment';
import { EnumValues } from 'enum-values';
import { PolicyNumberStatus, PolicyNumberStatusConstants } from '../../../enums/policyNumberStatus';
import { OrderType } from '../../../enums/orderType';
import { LazyLoadEvent } from 'primeng/api';
import { ReportsService } from '../../../services/reports.service';
import { ObligedDischargedReportDto } from '../../../dtos/obligedDischargedReportDto';
import { Table } from 'primeng/table';

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
  selector: 'app-obligated-discharged-report',
  templateUrl: './obligated-discharged-report.component.html',
  providers : [InsuranceCompanyService,ReportsService,{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true }}]
})
export class ObligatedDischargedReportComponent implements OnInit {
@ViewChild('dt') dt: Table;
filter : any = {};
selectedInsurance : Insurance = null;
insurances : Insurance[] = new Array();
public policyNumberStatus = EnumValues.getNamesAndValues(PolicyNumberStatus);
obligatedDischargedTypes : PolicyNumberStatusConstants = new PolicyNumberStatusConstants();
SearchText : string;
totalReports : number;
obligatedDischargedPolicyNumbers : ObligedDischargedReportDto[] = new Array();
obligatedDischargedPolicyNumber : ObligedDischargedReportDto = new ObligedDischargedReportDto();
  constructor(private insurancesService: InsuranceCompanyService,
    private reportsService : ReportsService
    ) {
    this.insurancesService.FindAllActive().then(x => {
      if (x != null) {
        this.insurances = x.sort((a, b) => {
          return (a.Name.localeCompare(b.Name, environment.defaultLanguage))
        });
      }
    });
   }

  ngOnInit() {
    this.filter.Limit = 10;
    this.filter.Offset = 0;
    this.filter.SortingField = 'Id';
    this.filter.OrderType = OrderType.DESC;
    this.filter.SearchText = null;
    this.filter.Status = -1;
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
        this.reportsService.GetObligedDischargedReportCount(this.filter).then(x => { this.totalReports = x;
        this.reportsService.GetObligedDischargedReport(this.filter).then(y => { this.obligatedDischargedPolicyNumbers = y;})
      })
      }

      refreshReport(){
        this.dt.first = 0;
        this.filter.Offset = this.dt.first;
        this.generateReport();
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

}
