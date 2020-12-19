import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { DialogService, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { isObject } from 'util';
import { NotificationsService } from '../../../core/notifications.service';
import { TokenStorage } from '../../../core/tokenstorage.service';
import { OrderType } from '../../../enums/orderType';
import { VoucherStatus } from '../../../enums/voucherStatus';
import { User } from '../../../models/user';
import { Voucher } from '../../../models/voucher';
import { UsersService } from '../../../services/users.service';
import { VoucherService } from '../../../services/vouchers.service';
import { AgentsSearchComponent } from '../../users/agentsSearchDialog/agents-search/agents-search.component';

@Component({
  selector: 'app-voucher-obligate',
  templateUrl: './voucher-obligate.component.html',
  providers:[VoucherService,UsersService,DialogService]
})
export class VoucherObligateComponent implements OnInit {
  @ViewChild("dt") table : Table;
  vouchers: Voucher[] = new Array();
  filter: any = {}
  totalVouchers: number = null;
  voucherStatus = EnumValues.getNamesAndValues(VoucherStatus);
  SearchText : string = null;
  agents : User[] = new Array();
  selectedAgent : User = new User();
  selectedVouchers : Voucher[] = new Array();
  showCreated : boolean = false;
assignOptions : any = new Array();
  constructor(private router: Router,
    private voucherService: VoucherService,
    private usersService : UsersService,
    private translateService : TranslateService,
    private dialogService : DialogService,
    private tokenStorage : TokenStorage,
    private notificationService : NotificationsService
  ) {
    this.assignOptions.push({label: this.translateService.instant("ASSIGN"), icon : 'pi pi-angle-double-down',command: (event) => this.assignVoucher(this.selectedVouchers) })
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
  addOrEditVoucher(id:string){
    this.router.navigate(['obligatevouchers/', id]);
  }
  refreshVouchers(){
    this.table.first = 0;
    this.filter.Offset = this.table.first;
    if(this.filter.Status == 0){
      this.showCreated = true;
    }
    else{
      this.showCreated = false;
    }
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
  getAgents(){
    this.usersService.FindAllAssignedAgents().then(x=>{
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

  contextMenuSelected(event){
    this.assignOptions[0].disabled = false;
    let canAssign = false;
    this.selectedVouchers.forEach(selectedVoucher =>{
      if(selectedVoucher.Status == VoucherStatus.CreatedVoucher)
      canAssign = true;
      if(selectedVoucher.Status == VoucherStatus.AssignedVoucher)
      canAssign = false;
    })
    if(!canAssign){
      this.assignOptions[0].disabled = true;
    }
  }

  assignVoucher(selectedVoucher : Voucher[]){
    const ref = this.dialogService.open(AgentsSearchComponent, {
      header: this.translateService.instant("SELECT_AGENT"),
      styleClass: 'popupAgent'
    });
    ref.onClose.subscribe((users: any) => {
      if (users) {
        let userVoucherModel: any = {
          AssignTo: users.assignTo
        }
        let vouchers: number[] = new Array();
        this.selectedVouchers.forEach(selectedVoucher => {
          vouchers.push(selectedVoucher.Id);
        })
        userVoucherModel.Vouchers = vouchers;
        userVoucherModel.UpdatedBy = parseInt(this.tokenStorage.getUserId());
        userVoucherModel.Status = VoucherStatus.AssignedVoucher;
      this.voucherService.AssignVoucher(userVoucherModel).then(x=>{
        if(x){
          this.notificationService.success("OBLIGATE_VOUCHERS","SUCCESSFULLY_ASSIGNED");
          this.refreshVouchers();
          this.selectedVouchers = new Array();
        }
      });
      }
    });
  }
  isNewVoucherSelected(voucher : Voucher){
    if (this.selectedVouchers != null) {
      let existingVoucher = this.selectedVouchers.find(x => x.Id == voucher.Id && x.Number == voucher.Number && x.AddedBy == voucher.AddedBy);
      if (existingVoucher != null)
        return true;
    }
    return false;
  }
}
