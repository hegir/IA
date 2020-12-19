import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist/dist/chartist.component';
import { NotificationsService } from '../core/notifications.service';
import { PolicyNumber } from '../models/policyNumber';
import { PolicyNumberService } from '../services/policy-number.service';
import { UsersService } from '../services/users.service';
import { PolicyHolderService } from '../services/policy-holder.service';
import { PolicyService } from '../services/policy.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { TokenStorage } from '../core/tokenstorage.service';
import { environment } from '../../environments/environment';
import { ArniAutoCompleteComponent } from "../autocomplete/autocomplete.component";
import { Insurance } from "../models/insuranceCompany";
import { InsuranceCompanyService } from "../services/insurance-companies.service";
import { isObject } from "util";
import { EnumValues } from 'enum-values';
import { PolicyNumberStatus } from '../enums/policyNumberStatus';
import { OrderType } from '../enums/orderType';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { DeleteConfirmationDirective } from '../directives/delete.confirmation.directive';
import { Policy } from '../models/policy';
import { ExpectedPaymentDto } from '../dtos/expectedPaymentDto';
import { SkadencaReportDto } from '../dtos/skadencaReportDto';
import { ReportsService } from '../services/reports.service';
declare var require: any;

export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers:[PolicyNumberService,UsersService,PolicyHolderService,DeleteConfirmationDirective,PolicyService,NgxPermissionsService, ReportsService,InsuranceCompanyService]

})
export class DashboardComponent implements AfterViewInit {
  @ViewChild("dt") table : Table;
  @ViewChild("insuranceComponent") insuranceComponent : ArniAutoCompleteComponent<Insurance>
  policyNumbers:PolicyNumber[]=new Array();
  policyNumber:PolicyNumber=new PolicyNumber();
  FilteredPolicyNumber:string=null;
  FilteredInsuranceName:string=null;
  numberOfAgents : number;
  numberOfPolicyHolders : number;
  numberOfPolicies : number;
  numberOfActivePolicyNumbers : number;
  @ViewChild("insuranceComponent")
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
  threeDaysBeforeToday:Date;
  totalSkadenca : number = 0;
  skadencas : SkadencaReportDto[] = new Array();
  skadenca : SkadencaReportDto = new SkadencaReportDto();
  expectedPayments : ExpectedPaymentDto[] = new Array();
  today : Date = new Date();
  constructor(
    private insuranceCompanyService: InsuranceCompanyService,
    private router: Router,
    public deleteDirective: DeleteConfirmationDirective,
    private notificationService: NotificationsService,
    private translateService:TranslateService,
    private usersService : UsersService,
    private policyHoldersService : PolicyHolderService,
    private policyService : PolicyService,
    private policyNumbersService : PolicyNumberService,
    private permissionService : NgxPermissionsService,
    private reportsService : ReportsService,
    private tokenStorage : TokenStorage)
    {
    this.threeDaysBeforeToday=new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      this.policyService.FindPoliciesForDashboard().then(p=>{
        if(p!=null){
          this.policies=p;
        }
        this.usersService.FindAllPayments().then(y=>{
          if(y != null){
            this.expectedPayments = y;
          }
        })
      });
    }
    ngOnInit() {
      this.dashboardCount();
      this.permissionService.loadPermissions(this.tokenStorage.getUserPermissions());
  }
dashboardCount(){
      this.usersService.CountAllAgents().then(x=>{
        if(x!=null){
          this.numberOfAgents = x;
        }
        this.policyHoldersService.Count().then(y=>{
          if(y != null){
            this.numberOfPolicyHolders = y;
          }
          this.policyService.Count().then(z=>{
            if(z != null){
              this.numberOfPolicies = z;
            }
            this.policyNumbersService.CountAllActive().then(k=>{
              if(k != null){
                this.numberOfActivePolicyNumbers = k;
              }
            })
          })
        })
      })
}
addOrEditPolicy(id: string) {
  this.router.navigate(['policies/', id]);
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

  goToAgents(){
    this.router.navigate(['/users']);
  }
  goToPolicyHolders(){
    this.router.navigate(['/policyholders']);
  }
  goToPolicies(){
    this.router.navigate(['/policies']);
  }
  ngAfterViewInit() {
    // Sparkline chart
    const sparklineLogin = function () {
      // spark count
      (<any>$(".spark-count")).sparkline(
        [4, 5, 0, 10, 9, 12, 4, 9, 4, 5, 3, 10, 9, 12, 10, 9, 12, 4, 9],
        {
          type: "bar",
          width: "100%",
          height: "70",
          barWidth: "2",
          resize: true,
          barSpacing: "6",
          barColor: "rgba(255, 255, 255, 0.3)",
        }
      );
    };
    let sparkResize;
    (<any>$(window)).resize(function (e) {
      clearTimeout(sparkResize);
      sparkResize = setTimeout(sparklineLogin, 500);
    });
    sparklineLogin();
  }


  goToPolicyPayment(policyId : any){
this.router.navigate([`policies/${policyId}/payments`]);
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

      this.reportsService.GetSkadencaReportCount(this.filter).then(x => { this.totalSkadenca = x;})
      this.reportsService.GetSkadencaReport(this.filter).then(y => { this.skadencas = y;})
    }




}
