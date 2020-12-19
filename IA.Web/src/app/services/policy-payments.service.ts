import { Injectable } from '@angular/core';
import { RequestService } from "../core/request.service";
import { PolicyPayment } from '../models/policyPayments';

@Injectable()
export class PolicyPaymentsService  {
  controller : string = "policies/"
    constructor(protected requestService: RequestService) {
    }
public FindAllPayments(policyId : string) : Promise<PolicyPayment[]>{
  return this.requestService.get(this.controller.concat(`${policyId}/payments`)).toPromise()
  .then(res=>{return <PolicyPayment[]> res;})
}
public Save(policyId : string,policyPayment : PolicyPayment) : Promise<PolicyPayment>{
  return this.requestService.post(this.controller.concat(`${policyId}/payments`),policyPayment).toPromise()
  .then(res=>{return <PolicyPayment> res;})
}
public DeletePolicyPayment(policyId : number,paymentId : number): Promise<PolicyPayment>{
  return this.requestService.delete(this.controller.concat(`${policyId}/payments/${paymentId}`)).toPromise()
  .then(res=> {return <PolicyPayment> res;})
}
public FindPaymentById(policyId : number,paymentId : number) : Promise<PolicyPayment>{
  return this.requestService.get(this.controller.concat(`${policyId}/payments/${paymentId}`)).toPromise()
  .then(res=> {return <PolicyPayment> res;})
}
}
