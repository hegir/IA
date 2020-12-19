import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MainOffice } from '../../../models/mainOffice';
import { NgForm, FormGroup } from "@angular/forms";
import { MainOfficesService } from '../../../services/main-offices.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../models/company';
import { CompaniesService } from '../../../services/companies.service';
import { NotificationsService } from '../../../core/notifications.service';
import { ValidationService } from '../../../core/validation.service';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/user';
import { UsersMainOfficesService } from '../../../services/users-main-office.service.';
import { UserMainOffice } from '../../../models/userMainOffice';


@Component({
  selector: 'app-main-offices-details',
  templateUrl: './main-offices-details.component.html',
  providers: [MainOfficesService,CompaniesService,ValidationService,UsersService,UsersMainOfficesService],
})
export class MainOfficesDetailsComponent implements OnInit {
@ViewChild('form')form;
mainOfficeId:string;
isNewMainOffice:boolean;
mainOffice: MainOffice=new MainOffice();
mainOffices: MainOffice[]=new Array();
companies: Company[]=new Array();
agents : User[] = new Array();
public validationErrors: any;
  constructor(private location: Location,
              private mainOfficesService:MainOfficesService,
              private route:ActivatedRoute,
              private companiesService:CompaniesService,
              private notificationService: NotificationsService,
              private validationService:ValidationService,
              private router:Router,
              private usersService : UsersService,
              private usersMainOfficesService : UsersMainOfficesService
              )
{
   this.mainOfficeId=this.route.snapshot.paramMap.get("id");
   this.isNewMainOffice=this.mainOfficeId=="0";
   if(!this.isNewMainOffice){
     this.mainOfficesService.FindById(this.mainOfficeId).then( x=>{
       if(x != null){
         this.mainOffice=x;
       }
     })
   }
   this.usersService.FindAllAgents().then(y=>{
    if(y != null){
      this.agents = y;
    }
  })
}

  ngOnInit() {
  if(this.companies.length==0)
  {
    this.companiesService.Find().then(x =>{
      if(x != null){
        this.companies=x;
      }
    })
  }
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
  this.mainOffice.isActive=true;
  this.mainOfficesService.Save(this.mainOffice).then(x =>{
    if(x != null){
      this.mainOffice=x;
      this.agents.forEach(agent=>{
        let userMainOffice = new UserMainOffice();
        userMainOffice.MainOfficeId = this.mainOffice.Id;
        userMainOffice.UserId = agent.Id;
        this.usersMainOfficesService.PostUserMainOffice(agent.Id.toString(),userMainOffice).then(y=>{
          userMainOffice = y;
        })
      })
      if(this.isNewMainOffice){
        this.notificationService.success("MAIN_OFFICE_INFO","ADDED_SUCCESSFULLY");
        this.notificationService.success("AGENTS","ADDED_SUCCESSFULLY");
        this.router.navigate(['/mainoffices']);
      }
      else{
        this.notificationService.success("MAIN_OFFICE_INFO","UPDATED_SUCCESSFULLY");
      }
    }
  })
}
  }
}
