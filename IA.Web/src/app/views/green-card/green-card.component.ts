import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EnumValues } from 'enum-values';
import { DynamicDialogConfig, DynamicDialogRef, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { isObject } from 'util';
import { NotificationsService } from '../../core/notifications.service';
import { TokenStorage } from '../../core/tokenstorage.service';
import { ValidationService } from '../../core/validation.service';
import { GreenCardStatus } from '../../enums/greenCardStatus';
import { OrderType } from '../../enums/orderType';
import { GreenCard } from '../../models/greenCard';
import { User } from '../../models/user';
import { GreenCardService } from '../../services/green-card.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-green-card',
  templateUrl: './green-card.component.html',
  providers:[GreenCardService,ValidationService,TokenStorage, NotificationsService,UsersService,]

})
export class GreenCardComponent implements OnInit {
  greenCard: GreenCard = new GreenCard();
  validationErrors: any = {};
  @ViewChild("dt") table : Table;
  greenCards: GreenCard[] = new Array();
  filter: any = {}
  totalGreenCards: number = null;
  greenCardStatus = EnumValues.getNamesAndValues(GreenCardStatus);
  SearchText : string = null;
  agents : User[] = new Array();
  selectedAgent : User = new User();
  constructor(
    private greenCardService: GreenCardService,
    private notificationService: NotificationsService,private tokenstorage:TokenStorage,
    private router : Router,
    private usersService : UsersService) {
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
    this.getGreenCards();
  }
  refreshGreenCards(){
    this.table.first = 0;
    this.filter.Offset = this.table.first;
    this.getGreenCards();
  }
  getGreenCards(){
    if (this.SearchText != null)
    this.filter.SearchText = this.SearchText.trim();
    this.greenCardService.CountAll(this.filter).then(x=>{
      if(x != null){
        this.totalGreenCards = x;
      }
    })
    this.greenCardService.FindAll(this.filter).then(y=>{
      if(y != null){
        this.greenCards = y;
      }
    })
  }
  onDelete(event) {
    if (event != null) {
      this.greenCardService.Delete(event).toPromise().then(x => {
        let index = this.greenCards.findIndex(z => z.Id == event);
        this.greenCards.splice(index, 1);
        this.notificationService.success("POLICY_NUMBERS", "DELETED_SUCCESSFULY");
      });
    }
  }
  addOrEditGreenCard(id : string){
this.router.navigate(['greencards/',id]);
  }
  getAgents(){
    this.usersService.FindAllAssignedAgents().then(x=>{
      if(x != null){
        this.agents = x;
      }
    })
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
