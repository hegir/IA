import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { NotificationsService } from '../../core/notifications.service';
import { ValidationService } from '../../core/validation.service';
import { Color } from '../../models/color';
import { ColorService } from '../../services/colors.service';

@Component({
  selector: 'app-new-color',
  templateUrl: './new-color.component.html',
  providers:[ColorService,ValidationService, NotificationsService]
})

export class NewColorComponent implements OnInit {
  color:Color=new Color();
validationErrors: any = {};
@ViewChild('form')form;

  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private colorService: ColorService,
    private validationService: ValidationService,
    private notificationService: NotificationsService) { }

  ngOnInit() {
  }

  save(form:FormGroup){
    if(form.invalid){
      this.validationErrors=this.validationService.PrepareRequiredFieldErrors(form);
    }
    else{
      this.validationErrors={};
      this.colorService.Save(this.color).then(c=>{
        if(c!=null){
          this.color=c;
          this.form.resetForm();
          this.ref.close(this.color);
        }
      });
    }
  }
  close(){
    this.ref.close();
  }
}
