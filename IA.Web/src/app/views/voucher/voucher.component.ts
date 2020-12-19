import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { LazyLoadEvent } from 'primeng/api';
import { isObject } from 'util';
import { NotificationsService } from '../../core/notifications.service';
import { DeleteConfirmationDirective } from '../../directives/delete.confirmation.directive';
import { OrderType } from '../../enums/orderType';
import { VoucherStatus } from '../../enums/voucherStatus';
import { User } from '../../models/user';
import { Voucher } from '../../models/voucher';
import { UsersService } from '../../services/users.service';
import { VoucherService } from '../../services/vouchers.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  providers:[VoucherService,UsersService,NotificationsService,DeleteConfirmationDirective,TranslateService]
})
export class VoucherComponent implements OnInit {
  vouchers:Voucher[]=new Array();
  @ViewChild("dt") table;
  filter: any = {}
  totalVouchers: number = null;
  voucherStatus = EnumValues.getNamesAndValues(VoucherStatus);
  SearchText : string = null;
  agents : User[] = new Array();
  selectedAgent : User = new User();
  constructor(private voucherService: VoucherService,
    private userService:UsersService,
    private router: Router,
    private notificationService: NotificationsService,private translateService:TranslateService,
    public deleteDirective:DeleteConfirmationDirective) {

     }

  ngOnInit() {
    this.filter.Limit = 10;
    this.filter.Offset = 0;
    this.filter.SortingField = 'Number';
    this.filter.OrderType = OrderType.DESC;
    this.filter.SearchText = null;
    this.filter.Status = -1;
  }
  loadGreenCards(event : LazyLoadEvent){
    if(event.sortField == undefined){
      this.filter.SortingField = 'Number';
    }
    else{
      this.filter.SortingField = event.sortField;
    }
    if(event.sortOrder == undefined){
      this.filter.OrderType = OrderType.DESC;
    }
    else{
      this.filter.OrderType = event.sortOrder == -1 ? OrderType.ASC : event.sortOrder;
    }
    this.filter.Limit = event.rows.toString();
    this.filter.Offset = event.first.toString();
    this.getVouchers();
  }
  refreshVouchers(){
    this.table.first = 0;
    this.filter.Offset = this.table.first;
    this.getVouchers();
  }
  getVouchers(){
    if (this.SearchText != null)
    this.filter.SearchText = this.SearchText.trim();
    this.voucherService.CountAll(this.filter).then(x=>{
      if(x != null){
        this.totalVouchers = x;
      }
    })
    this.voucherService.FindAll(this.filter).then(y=>{
      if(y != null){
        this.vouchers = y;
      }
    })
  }
  addOrEditVoucher(id:string){
    this.router.navigate(['vouchers/', id]);
  }
  onDelete(event){
    if (event != null) {
      this.voucherService.Delete(event).toPromise().then(x => {
        let index = this.vouchers.findIndex(z => z.Id == event);
        this.vouchers.splice(index, 1);
        this.notificationService.success("VOUCHERS", "DELETED_SUCCESSFULY");
      });
    }
  }
  getAgents(){
    this.userService.FindAllAssignedAgents().then(x=>{
      if(x != null){
        this.agents = x;
      }
    });
  }
  onSelectedAgentChange(event){
    if(event==null || event=="")
    return;
    if(isObject(event)){
      this.selectedAgent=event;
      this.filter.AssignedTo = this.selectedAgent.Id;
    }else{
      this.selectedAgent=null;
      this.filter.AssignedTo = null;
    }
  }
}
