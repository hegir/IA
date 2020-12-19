import { Component, OnInit, ViewChild } from '@angular/core';
import { DeleteConfirmationDirective } from '../../directives/delete.confirmation.directive';
import { PartnerService } from '../../services/partners.service';
import { Router } from '@angular/router';
import { NotificationsService } from '../../core/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Partner } from '../../models/partner';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  providers:[PartnerService,DeleteConfirmationDirective]
})
export class PartnerComponent implements OnInit {
  partners:Partner[]=new Array();
  @ViewChild("dt") table;
  constructor(private partnerService: PartnerService,
    private router: Router,
    private notificationService: NotificationsService,private translateService:TranslateService,
    public deleteDirective:DeleteConfirmationDirective) {
      this.partnerService.Find().then((c)=>{
        if(c!=null)
          this.partners=c.sort((a,b)=>{
            return(a.Name.localeCompare(b.Name,environment.defaultLanguage))
          });
      });
     }

  ngOnInit() {
  }
  addOrEditPartner(id: string) {
    this.router.navigate(['partners/', id]);
  }
  onDelete(event) {
    if (event != null) {
      this.partnerService.Delete(event).toPromise().then(x => {
        let index = this.partners.findIndex(z => z.Id == event);
        this.partners.splice(index, 1);
        this.notificationService.success("PARTNERS", "DELETED_SUCCESSFULY");
      });
    }
  }
}
