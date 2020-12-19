import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../core/notifications.service';
import { DeleteConfirmationDirective } from '../../directives/delete.confirmation.directive';
import { TechnicalInspection } from '../../models/technicalInspection';
import { TechnicalInspectionService } from '../../services/technical-inspection.service';

@Component({
  selector: 'app-technical-inspection',
  templateUrl: './technical-inspection.component.html',
  providers:[TechnicalInspectionService,DeleteConfirmationDirective]
})
export class TechnicalInspectionComponent implements OnInit {
  technicalInspections:TechnicalInspection[]=new Array();
  @ViewChild("dt") table;
  constructor(private technicalInspectionService: TechnicalInspectionService,
    private router: Router,
    private notificationService: NotificationsService,private translateService:TranslateService,
    public deleteDirective:DeleteConfirmationDirective) {
      this.technicalInspectionService.Find().then(t=>{
        if(t!=null){
          this.technicalInspections=t;
        }
      });
     }

  ngOnInit() {
  }
  addOrEditTechnicalInspection(id: string) {
    this.router.navigate(['technicalinspections/', id]);
  }
  onDelete(event) {
    if (event != null) {
      this.technicalInspectionService.Delete(event).toPromise().then(x => {
        let index = this.technicalInspections.findIndex(z => z.Id == event);
        this.technicalInspections.splice(index, 1);
        this.notificationService.success("TECHNICAL_INSPECTIONS", "DELETED_SUCCESSFULY");
      });
    }
  }
}
