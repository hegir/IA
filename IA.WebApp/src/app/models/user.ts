import { Gender } from "../enums/gender";
import {UserStatus} from "../enums/userStatus"

export class User{
  Id:number;
  FirstName:string;
  LastName:string;
  Username:string;
  Status:UserStatus;
  RoleId:string;
  BirthDate:Date; //TODO:: ADD
  PhoneNumber:string;
  Email:string;
  Gender:Gender; //TODO:: ADD
  Password:string;
  FullName: string;
}
