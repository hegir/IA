import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../../core/notifications.service';
import { DeleteConfirmationDirective } from '../../../directives/delete.confirmation.directive';
import { ContractedComission } from '../../../models/contractedComission';
import { ContractedComissionService } from '../../../services/contracted-comission.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-contracted-comission',
  templateUrl: './contracted-comission.component.html',
  providers:[ContractedComissionService,DeleteConfirmationDirective]
})
export class ContractedComissionComponent implements OnInit {
contractedComissions:ContractedComission[]=new Array();
@ViewChild("dt") table;

  constructor(private contractedComissionService: ContractedComissionService,
    private router: Router,
    private notificationService: NotificationsService,private translateService:TranslateService,
    public deleteDirective:DeleteConfirmationDirective) {
      this.contractedComissionService.Find().then((c)=>{
        if(c!=null)
          this.contractedComissions=c.sort((a,b)=>{
            return(a.Name.localeCompare(b.Name,environment.defaultLanguage))
          });
      });
     }

  ngOnInit() {
  }

  addOrEditContractedComission(id: string) {
    this.router.navigate(['contractedcomissions/', id]);
  }
  onDelete(event) {
    if (event != null) {
      this.contractedComissionService.Delete(event).toPromise().then(x => {
        let index = this.contractedComissions.findIndex(z => z.Id == event);
        this.contractedComissions.splice(index, 1);
        this.notificationService.success("CONTRACTED_COMISSION", "DELETED_SUCCESSFULY");
      });
    }
  }

}
