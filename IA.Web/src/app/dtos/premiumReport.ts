import { InsuranceType } from "../models/insuranceTypes";

export class PremiumReportDto{
  MainOfficeName : string;
  InsuranceName : string;
  PolicyExpiration : Date;
  InsuranceType : string;
  Created  : Date;
  Number : string;
  PolicyHolderFullName : string;
  Price  : number;
  CarAccidentCompensation : number;
  Total : number;
  PolicyId : number;
  CompanyName : string;
}
