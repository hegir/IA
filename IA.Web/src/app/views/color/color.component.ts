import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { environment } from '../../../environments/environment';
import { NotificationsService } from '../../core/notifications.service';
import { Color } from '../../models/color';
import { ColorService } from '../../services/colors.service';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  providers:[ColorService,NotificationsService,TranslateService]
})
export class ColorComponent implements OnInit {
  @ViewChild("dt") table : Table;
  colors : Color[] = new Array();

  constructor(private colorService : ColorService,
    private router : Router,
    private notificationService : NotificationsService,private transtaleService:TranslateService) {
      this.colorService.Find().then(c=>{
        if(c!=null){
          this.colors=c;
          this.colors = c.sort((a,b)=>{
            return a.Name.localeCompare(b.Name,environment.defaultLanguage);
          });
        }
      });
     }

  ngOnInit() {
  }
  editColor(id : string){
    this.router.navigate(['colors/',id])
}
onDelete(event){
  if(event != null){
    this.colorService.Delete(event).toPromise().then(x=>{
      let index = this.colors.findIndex(x=>x.Id == event);
      this.colors.splice(index,1);
      this.notificationService.success("VEHICLE_COLORS", "DELETED_SUCCESSFULY");
      this.table.reset();
    });
  }
}
}
