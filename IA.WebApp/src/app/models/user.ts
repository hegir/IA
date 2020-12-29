import { Gender } from "../enums/gender";
import {UserStatus} from "../enums/userStatus"

export class User{
  Id:number;
  FirstName:string;
  LastName:string;
  Username:string;
  Status:UserStatus;
  RoleId:string;
  PhoneNumber:string;
  Email:string;
  Password:string;
  RepeatPassword:string;
  FullName: string;
}
