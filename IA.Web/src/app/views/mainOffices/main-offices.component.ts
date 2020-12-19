import { Component, OnInit } from '@angular/core';
import { MainOffice } from '../../models/mainOffice';
import { MainOfficesService } from '../../services/main-offices.service';
import { Router } from '@angular/router';
import { NotificationsService } from '../../core/notifications.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-main-offices',
  templateUrl: './main-offices.component.html',
  providers: [MainOfficesService]
})
export class MainOfficesComponent implements OnInit {
public mainOffices: MainOffice[]=new Array();
  constructor(private mainOfficeService:MainOfficesService,
    private router:Router,
    private notificationService:NotificationsService) {
    this.mainOfficeService.FindAllActive().then( x=>{
      if( x != null){
        this.mainOffices=x.sort((a,b)=>{
          return (a.Name.localeCompare(b.Name,environment.defaultLanguage))
        })
      }
    })
   }

  ngOnInit() {}

editMainOffice(id:string)
{
  this.router.navigate(['mainoffices/',id])
}

onDelete(event){
  if(event != null){
    let item = this.mainOffices.find(x=> x.Id == event);
    item.isActive = false;
    this.mainOfficeService.Update(item).then(x =>{
     let index = this.mainOffices.findIndex(z=> z.Id == event);
     this.mainOffices.splice(index,1);
     this.notificationService.success("INSURANCE_COMPANIES", "DELETED_SUCCESSFULY");
    })
  }
}
}
