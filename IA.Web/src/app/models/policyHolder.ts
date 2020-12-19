import { PolicyHolderType } from "../enums/policyHolderType";

export class PolicyHolder{
  Id: number;
  FirstName: string;
  LastName: string;
  PersonalIdentificationNumber:string;
  Address: string;
  CityId: number;
  CityName :string;
  FullName:string;
  FullNameCity:string;
  FullNameCityPIN:string;
  CityMunicipalityCode : string;
  PolicyHolderType : PolicyHolderType;
  CompanyName : string;
  DisplayName : string;
}
