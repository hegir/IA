import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { RequestService } from "../core/request.service";
import { BaseCrudService } from "../core/basecrud.service";
import { Policy } from "../models/policy";
import { TokenStorage } from "../core/tokenstorage.service";

@Injectable({
  providedIn: "root",
})
export class PolicyService extends BaseCrudService<Policy> {
  constructor(
    protected translateService: TranslateService,
    protected requestService: RequestService,
    protected tokenStorage: TokenStorage
  ) {
    super("policies/", translateService, requestService, tokenStorage);
  }
  public FindPoliciesForDashboard():Promise<Policy[]>{
    return this.requestService.get(this.controller.concat('dashboardpolicies'))
    .toPromise()
    .then(res => { return <Policy[]>res });
  }
  public FindAllPolicies(filter: any): Promise<Policy[]> {
    let data: any = {
      limit: filter.Limit,
      offset: filter.Offset,
      sortingField: filter.SortingField,
      order: filter.OrderType,
    };
    if (filter.SearchText != null) data.searchText = filter.SearchText;

    if (filter.SearchInsurance != null)
      data.searchInsurance = filter.SearchInsurance;

    if (filter.PolicyBegin != null) data.policyBegin = filter.PolicyBegin;

    if (filter.PolicyBeginUntil != null)
      data.policyBeginUntil = filter.PolicyBeginUntil;

    if (filter.PolicyExpiration != null)
      data.policyExpiration = filter.PolicyExpiration;

    if (filter.PolicyExpirationUntil != null)
      data.policyExpirationUntil = filter.PolicyExpirationUntil;

    if (filter.InsuranceId != null) data.insuranceId = filter.InsuranceId;

    if (filter.UserId != null) data.userId = filter.UserId;

    if (filter.PolicyHolderId != null)
      data.policyHolderId = filter.PolicyHolderId;

    return this.requestService
      .get(this.controller.concat("find"), data)
      .toPromise()
      .then((res) => {
        return <Policy[]>res;
      });
  }
  public CountAll(filter: any): Promise<number> {
    let data: any = {};
    if (filter.SearchText != null) data.searchText = filter.SearchText;

    if (filter.SearchInsurance != null)
      data.searchInsurance = filter.SearchInsurance;

    if (filter.PolicyBegin != null) data.policyBegin = filter.PolicyBegin;

    if (filter.PolicyBeginUntil != null)
      data.policyBeginUntil = filter.PolicyBeginUntil;

    if (filter.PolicyExpiration != null)
      data.policyExpiration = filter.PolicyExpiration;

    if (filter.PolicyExpirationUntil != null)
      data.policyExpirationUntil = filter.PolicyExpirationUntil;

    if (filter.UserId != null) data.userId = filter.UserId;

    if (filter.InsuranceId != null) data.insuranceId = filter.InsuranceId;

    if (filter.PolicyHolderId != null)
      data.policyHolderId = filter.PolicyHolderId;
    return this.requestService
      .get(this.controller.concat("find/count"), data)
      .toPromise()
      .then((res) => {
        return <number>res;
      });
  }
}
