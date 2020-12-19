import { PolicyNumberStatus } from "../enums/policyNumberStatus";

export class ObligedDischargedReportDto{
  InsuranceName : string;
  PolicyNumber : string;
  PolicyNumberAdded : Date;
  Status : PolicyNumberStatus;
}
