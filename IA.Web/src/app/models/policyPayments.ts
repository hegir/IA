import { PaymentMethod } from "../enums/paymentMethod";

export class PolicyPayment{
  Id : number;
  PolicyId : number;
  PaymentMethod : PaymentMethod;
  Amount : number;
  PaymentDate : Date;
  Note : string;
  AddedBy : number;
  Added : Date;
  AddedByFullName : string;
  Installment : number;
  ExpectedPaymentDate : Date;
}
