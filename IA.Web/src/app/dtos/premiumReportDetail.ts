import { VehicleType } from "../enums/vehicleType";

export class PremiumReportDetail{
  PolicyId : number;
  Netto : number;
  CommissionIncome : number;
  PolicyHolder : string;
  TechnicalInspection : number;
  Number : string;
  Price : number;
  PersonalIdentificationNumber : string;
  Address : string;
  CityName : string;
  VehicleType : VehicleType;
  CarBrand : string;
  CarModel : string;
  LicensePlate : string;
  ProductionYear : number;
  EnginePower : number;
  EngineDisplacement : number;
  LoadCapacity : number;
  MaxPermissibleMass : number;
  SeatsNumber : number;
  Color : string;
  ChassisNumber : string;
  EngineNumber : string;
  MunicipalityCode : string;
}
