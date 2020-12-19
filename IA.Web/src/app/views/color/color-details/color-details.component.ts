import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { ColorService } from '../../../services/colors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../core/notifications.service';
import { ValidationService } from '../../../core/validation.service';
import { Color } from '../../../models/color';


@Component({
  selector: 'app-color-details',
  templateUrl: './color-details.component.html',
  providers:[ColorService,NotificationsService,ValidationService]
})
export class ColorDetailsComponent implements OnInit {
  public validationErrors: any;
  colorId:string;
  isNewColor:boolean;
  color:Color=new Color();
  @ViewChild('form')form;

  constructor(private location: Location,
    private colorService:ColorService,
    private route:ActivatedRoute,
    private notificationService: NotificationsService,
    private validationService:ValidationService,
    private router:Router) {
      this.colorId=this.route.snapshot.paramMap.get("id");
      this.isNewColor=this.colorId=="0";
      if(!this.isNewColor){
        this.colorService.FindById(this.colorId).then(x=>{
          if(x != null){
            this.color=x;
          }
        });
      }
     }

  ngOnInit() {
  }

  back(){
    this.location.back();
  }

  add(form:FormGroup){
    if(form.invalid){
      this.validationErrors=this.validationService.PrepareRequiredFieldErrors(form);
    }
    else{
      this.validationErrors={};
      this.colorService.Save(this.color).then(x =>{
        if(x != null){
          this.color=x;
          if(this.isNewColor){
          this.notificationService.success("VEHICLE_COLORS","ADDED_SUCCESSFULLY");
          this.router.navigate(['/colors']);
          }
          else
          this.notificationService.success("VEHICLE_COLORS","UPDATED_SUCCESSFULLY");
        }
      });
    }
  }
}
