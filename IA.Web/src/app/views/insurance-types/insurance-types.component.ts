import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { event } from 'jquery';
import { Table } from 'primeng/table';
import { environment } from '../../../environments/environment';
import { NotificationsService } from '../../core/notifications.service';
import { InsuranceType } from '../../models/insuranceTypes';
import { InsuranceTypesService } from '../../services/insurance-types.service';

@Component({
  selector: 'app-insurance-types',
  templateUrl: './insurance-types.component.html',
  providers : [InsuranceTypesService]
})
export class InsuranceTypesComponent implements OnInit {
@ViewChild("dt") table : Table;
insuranceTypes : InsuranceType[] = new Array();
insuranceType : InsuranceType = new InsuranceType();
FilteredInsuranceTypeName : string = null;
FilteredInsuranceTypeLabel : string = null;
  constructor(private insuranceTypesService : InsuranceTypesService,
              private router : Router,
              private notificationService : NotificationsService) {
    this.insuranceTypesService.Find().then(x=>{
      if(x != null){
        this.insuranceTypes = x.sort((a,b)=>{
          return a.Label.localeCompare(b.Label,environment.defaultLanguage);
        });
      }
    })
  }

  ngOnInit() {
  }
editInsuranceType(id : string){
    this.router.navigate(['insurancetypes/',id])
}
onDelete(event){
  if(event != null){
    this.insuranceTypesService.Delete(event).toPromise().then(x=>{
      let index = this.insuranceTypes.findIndex(x=>x.Id == event);
      this.insuranceTypes.splice(index,1);
      this.notificationService.success("INSURANCE_TYPES_PREVIEW", "DELETED_SUCCESSFULY");
      this.table.reset();
    })
  }
}
  filter() {
    if (this.FilteredInsuranceTypeName != null) {
      this.table.filter(this.FilteredInsuranceTypeName, "Name", "contains")
    }
    else {
      this.table.filter("", "Name", "contains");
    }
    if (this.FilteredInsuranceTypeLabel != null) {
      this.table.filter(this.FilteredInsuranceTypeLabel, "Label", "contains")
    }
    else {
      this.table.filter("", "Label", "contains");
    }
  }
}
