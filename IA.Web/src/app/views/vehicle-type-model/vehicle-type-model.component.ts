import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { NotificationsService } from '../../core/notifications.service';
import { TokenStorage } from '../../core/tokenstorage.service';
import { ValidationService } from '../../core/validation.service';
import { VehicleTypeModel } from '../../models/vehicleTypeModel';
import { VehicleTypeModelService } from '../../services/vehicle-type-model.service';

@Component({
  selector: 'app-vehicle-type-model',
  templateUrl: './vehicle-type-model.component.html',
  providers:[VehicleTypeModelService,ValidationService,TokenStorage, NotificationsService]
})
export class VehicleTypeModelComponent implements OnInit {
vehicleTypeModel:VehicleTypeModel=new VehicleTypeModel();
validationErrors: any = {};
@ViewChild('form')form;

  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private vehicleTypeModelService: VehicleTypeModelService,
    private validationService: ValidationService,
    private notificationService: NotificationsService,private tokenstorage:TokenStorage) { }

  ngOnInit() {
  }
  save(form:FormGroup){
    if(form.invalid){
      this.validationErrors=this.validationService.PrepareRequiredFieldErrors(form);
    }
    else{
      this.validationErrors={};
      this.vehicleTypeModelService.Save(this.vehicleTypeModel).then(v=>{
        if(v!=null){
          this.vehicleTypeModel=v;
          this.form.resetForm();
          this.ref.close(this.vehicleTypeModel);
        }
      });
    }
  }
  close(){
    this.ref.close();
  }
}
