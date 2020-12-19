export enum PolicyNumberStatus{
  Created,
  Assigned,
  Obliged,
  Completed,
  Storno,
  Returned,
  Discharged
}
export class PolicyNumberStatusConstants{
  public ReturnedTypes: PolicyNumberStatus[] = new Array(PolicyNumberStatus.Obliged,PolicyNumberStatus.Completed,PolicyNumberStatus.Storno,PolicyNumberStatus.Returned);
  public DischargedTypes : PolicyNumberStatus[] = new Array(PolicyNumberStatus.Returned,PolicyNumberStatus.Discharged);
  public ObligatedDischargedTypes : PolicyNumberStatus[] = new Array(PolicyNumberStatus.Obliged,PolicyNumberStatus.Returned,PolicyNumberStatus.Discharged);

}
