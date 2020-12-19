import { PolicyNumberStatus } from "../enums/policyNumberStatus";

export class PolicyNumber {
  Id: number;
  Number: string;
  InsuranceId: number;
  InsuranceName: string;
  Added: Date;
  AddedBy: number;
  Status: PolicyNumberStatus;
  UserFullName : string;
  AssignTo: number;
  AssignedTo: string;
  IsObligate: boolean;
  IsAssigned: boolean;
  UpdatedBy: number;
  IsReturned: boolean;
  StatusBefore: number;
  IsDischarged : boolean;
  ObligateDate : Date;
}
