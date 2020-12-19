import { FuelType } from "../enums/fuelType";
import { VehicleType } from "../enums/vehicleType";
import { Policy } from "./policy";


export class PolicyVehicle extends Policy{
  VehicleTypeModelId:number;
  VehicleType:VehicleType;
  ProductionYear:string;
  LicensePlate:string;
  EnginePower:number;
  EngineDisplacement:number;
  LoadCapacity:number;
  ColorId:number;
  ChassisNumber:string;
  EngineNumber:string;
  SeatsNumber:number;
  MaxPermissibleMass:number;
  VehicleTypeModel:string;
  VehicleTypeModelChassis:string;
  FuelType:FuelType;
}
