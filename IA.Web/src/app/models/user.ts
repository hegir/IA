import { Gender } from "../enums/gender";
import {UserStatus} from "../enums/userStatus"

export class User{
  Id:number;
  FirstName:string;
  LastName:string;
  Username:string;
  PasswordHash:string;
  Status:UserStatus;
  RoleId:string;
  PersonalIdentificationNumber:string;
  BirthDate:Date;
  PhoneNumber:string;
  Email:string;
  CityId:number;
  Gender:Gender;
  CityName:string;
  Address:string;
  Password:string;
  FullName: string;
  CompanyId:number;
  HasMainOffices : boolean;
  CityNameMunicipalityCode : string;
  AssignedToFullName : string
}
