import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RequestService } from '../core/request.service';
import { TokenStorage } from '../core/tokenstorage.service';
import { ObligedDischargedReportDto } from '../dtos/obligedDischargedReportDto';
import { PremiumAnalysisReportDto } from '../dtos/premiumAnalysisReportDto';
import { PremiumReportDto } from '../dtos/premiumReport';
import { PremiumReportDetail } from '../dtos/premiumReportDetail';

import { ServerSideDto } from '../dtos/serverSideDto';
import { SkadencaReportDto } from '../dtos/skadencaReportDto';
import { SpecificationsDto } from '../dtos/specificationsDto';



@Injectable()
export class ReportsService {
    controller: string = 'reports/';
    constructor(protected translateService: TranslateService, protected requestService: RequestService,
        protected tokenStorage: TokenStorage) {
    }

  public GetSpecificationsReport(filter: any): Promise<SpecificationsDto[]> {
    let data: any = {
      limit: filter.Limit,
      offset: filter.Offset,
      sortingField: filter.SortingField,
      order: filter.OrderType,
    }
    if (filter.DateFrom != null)
      data.dateFrom = filter.DateFrom;
    if (filter.DateTo != null)
      data.dateTo = filter.DateTo;
    if (filter.PolicyHolderId != null)
      data.policyHolderId = filter.PolicyHolderId;
    if (filter.SearchText != null)
      data.searchText = filter.SearchText;
    if (filter.InsuranceType != null)
    data.insuranceTypeId = filter.InsuranceType;
    if (filter.InsuranceId != null)
    data.insuranceId = filter.InsuranceId;

    return this.requestService.get(this.controller.concat('specifications'), data)
      .toPromise()
      .then(res => { return <SpecificationsDto[]>res });
  }



  public GetSpecificationsReportCount(filter: any): Promise<number> {
    let data: any = {}

    if (filter.DateFrom != null)
      data.dateFrom = filter.DateFrom;
    if (filter.DateTo != null)
      data.dateTo = filter.DateTo;
    if (filter.InsuranceId != null)
      data.insuranceId = filter.InsuranceId;
    if (filter.PolicyHolderId != null)
      data.policyHolderId = filter.PolicyHolderId;
    if (filter.SearchText != null)
      data.searchText = filter.SearchText;
    if (filter.InsuranceType != null)
      data.insuranceTypeId = filter.InsuranceType;
    return this.requestService.get(this.controller.concat('count'), data).toPromise()
      .then(res => { return <number>res; })
  }

  public GetPremiumReport(filter: any): Promise<PremiumReportDto[]> {
    let data: any = {
      limit: filter.Limit,
      offset: filter.Offset,
      sortingField: filter.SortingField,
      order: filter.OrderType,
    }
    if (filter.DateFrom != null)
      data.dateFrom = filter.DateFrom;
    if (filter.DateTo != null)
      data.dateTo = filter.DateTo;
    if (filter.MainOfficeId != null)
      data.mainOfficeId = filter.MainOfficeId;
    if (filter.InsuranceId != null)
      data.insuranceId = filter.InsuranceId;
      if (filter.PolicyHolderId != null)
      data.policyHolderId = filter.PolicyHolderId;
    if (filter.InsuranceType != null)
      data.insuranceTypeId = filter.InsuranceType;
    if (filter.SearchText != null)
      data.searchText = filter.SearchText;
    return this.requestService.get(this.controller.concat('premium'), data).toPromise()
      .then(res => { return <PremiumReportDto[]>res; })
  }

  public GetPremiumReportCount(filter: any): Promise<number> {
    let data: any = {}
    if (filter.DateFrom != null)
      data.dateFrom = filter.DateFrom;
    if (filter.DateTo != null)
      data.dateTo = filter.DateTo;
    if (filter.MainOfficeId != null)
      data.mainOfficeId = filter.MainOfficeId;
    if (filter.InsuranceId != null)
      data.insuranceId = filter.InsuranceId;
    if (filter.InsuranceType != null)
      data.insuranceTypeId = filter.InsuranceType;
    if (filter.SearchText != null)
      data.searchText = filter.SearchText;
    if(filter.PolicyHolderId != null)
    data.policyHolderId = filter.PolicyHolderId;
    return this.requestService.get(this.controller.concat('premium/count'), data).toPromise()
      .then(res => { return <number>res; })
  }
  public GetPremiumReportDetails(policyId: string):Promise<PremiumReportDetail>{
    return this.requestService.get(this.controller.concat(`premiumreportdetails/${policyId}`)).toPromise()
    .then(res=>{return <PremiumReportDetail> res;})
  }

  public GetSkadencaReport(filter: any): Promise<SkadencaReportDto[]> {
    let data: any = {
      limit: filter.Limit,
      offset: filter.Offset,
      sortingField: filter.SortingField,
      order: filter.OrderType,
    }
    if (filter.DateFrom != null)
      data.dateFrom = filter.DateFrom;
    if (filter.DateTo != null)
      data.dateTo = filter.DateTo;
    if (filter.MainOfficeId != null)
      data.mainOfficeId = filter.MainOfficeId;
    if (filter.InsuranceId != null)
      data.insuranceId = filter.InsuranceId;
      if (filter.PolicyHolderId != null)
      data.policyHolderId = filter.PolicyHolderId;
    if (filter.InsuranceType != null)
      data.insuranceTypeId = filter.InsuranceType;
    if (filter.SearchText != null)
      data.searchText = filter.SearchText;
    return this.requestService.get(this.controller.concat('skadenca'), data).toPromise()
      .then(res => { return <SkadencaReportDto[]>res; })
  }
  public GetSkadencaReportCount(filter: any): Promise<number> {
    let data: any = {}

    if (filter.DateFrom != null)
      data.dateFrom = filter.DateFrom;
    if (filter.DateTo != null)
      data.dateTo = filter.DateTo;
    if (filter.InsuranceId != null)
      data.insuranceId = filter.InsuranceId;
    if (filter.PolicyHolderId != null)
      data.policyHolderId = filter.PolicyHolderId;
    if (filter.SearchText != null)
      data.searchText = filter.SearchText;
      if (filter.MainOfficeId != null)
      data.mainOfficeId = filter.MainOfficeId;
    return this.requestService.get(this.controller.concat('skadenca/count'), data).toPromise()
      .then(res => { return <number>res; })
  }

  public GetObligedDischargedReport(filter: any): Promise<ObligedDischargedReportDto[]> {
    let data: any = {
      limit: filter.Limit,
      offset: filter.Offset,
      sortingField: filter.SortingField,
      order: filter.OrderType,
    }
    if (filter.DateFrom != null)
      data.dateFrom = filter.DateFrom;
    if (filter.DateTo != null)
      data.dateTo = filter.DateTo;
    if (filter.InsuranceId != null)
      data.insuranceId = filter.InsuranceId
    if (filter.SearchText != null)
      data.searchText = filter.SearchText;
    if (filter.Status != -1)
      data.status = filter.Status;
    return this.requestService.get(this.controller.concat('obliged'), data).toPromise()
      .then(res => { return <ObligedDischargedReportDto[]>res;})
  }
  public GetObligedDischargedReportCount(filter: any): Promise<number> {
    let data: any = {}

    if (filter.DateFrom != null)
      data.dateFrom = filter.DateFrom;
    if (filter.DateTo != null)
      data.dateTo = filter.DateTo;
    if (filter.InsuranceId != null)
      data.insuranceId = filter.InsuranceId
    if (filter.SearchText != null)
      data.searchText = filter.SearchText;
    if (filter.Status != -1)
      data.status = filter.Status;
    return this.requestService.get(this.controller.concat('obliged/count'), data).toPromise()
      .then(res => { return <number>res; })
  }
  public GetPremiumAnalysisReport(filter: any): Promise<PremiumAnalysisReportDto[]> {
    let data: any = {
      limit: filter.Limit,
      offset: filter.Offset,
      sortingField: filter.SortingField,
      order: filter.OrderType,
    }
    if (filter.DateFrom != null)
      data.dateFrom = filter.DateFrom;
    if (filter.DateTo != null)
      data.dateTo = filter.DateTo;
    if (filter.MainOfficeId != null)
      data.mainOfficeId = filter.MainOfficeId;
    if (filter.InsuranceType != null)
      data.insuranceTypeId = filter.InsuranceType;
    if (filter.UserId != null)
      data.userId = filter.UserId;
    return this.requestService.get(this.controller.concat('premiumanalysis'), data).toPromise()
      .then(res => { return <PremiumAnalysisReportDto[]>res; })
  }
  public GetPremiumAnalysisReportCount(filter: any): Promise<number> {
    let data : any = {};
    if (filter.DateFrom != null)
    data.dateFrom = filter.DateFrom;
  if (filter.DateTo != null)
    data.dateTo = filter.DateTo;
  if (filter.MainOfficeId != null)
    data.mainOfficeId = filter.MainOfficeId;
  if (filter.InsuranceType != null)
    data.insuranceTypeId = filter.InsuranceType;
  if (filter.UserId != null)
    data.userId = filter.UserId;
    return this.requestService.get(this.controller.concat('premiumanalysis/count'), data).toPromise()
      .then(res => { return <number>res; })
  }
  public GetPremiumAnalysisReportTotalPrice(filter: any): Promise<number> {
    let data : any = {};
    if (filter.DateFrom != null)
    data.dateFrom = filter.DateFrom;
  if (filter.DateTo != null)
    data.dateTo = filter.DateTo;
  if (filter.MainOfficeId != null)
    data.mainOfficeId = filter.MainOfficeId;
  if (filter.InsuranceType != null)
    data.insuranceTypeId = filter.InsuranceType;
  if (filter.UserId != null)
    data.userId = filter.UserId;
    return this.requestService.get(this.controller.concat('premiumanalysis/totalprice'), data).toPromise()
      .then(res => { return <number>res; })
  }

}
