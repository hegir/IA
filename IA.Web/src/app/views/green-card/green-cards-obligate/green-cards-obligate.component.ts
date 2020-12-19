import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { DialogService, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { isObject } from 'util';
import { NotificationsService } from '../../../core/notifications.service';
import { TokenStorage } from '../../../core/tokenstorage.service';
import { ValidationService } from '../../../core/validation.service';
import { GreenCardStatus } from '../../../enums/greenCardStatus';
import { OrderType } from '../../../enums/orderType';
import { GreenCard } from '../../../models/greenCard';
import { User } from '../../../models/user';
import { GreenCardService } from '../../../services/green-card.service';
import { UsersService } from '../../../services/users.service';
import { AgentsSearchComponent } from '../../users/agentsSearchDialog/agents-search/agents-search.component';

@Component({
  selector: 'app-green-cards-obligate',
  templateUrl: './green-cards-obligate.component.html',
  providers:[GreenCardService,UsersService,DialogService]

})
export class GreenCardsObligateComponent implements OnInit {
  @ViewChild("dt") table : Table;
  greenCards: GreenCard[] = new Array();
  filter: any = {}
  totalGreenCards: number = null;
  greenCardStatus = EnumValues.getNamesAndValues(GreenCardStatus);
  SearchText : string = null;
  agents : User[] = new Array();
  selectedAgent : User = new User();
  selectedGreenCards : GreenCard[] = new Array();
  showCreated : boolean = false;
assignOptions : any = new Array();
   constructor(
    private greenCardService: GreenCardService,
    private usersService : UsersService,
    private translateService : TranslateService,
    private dialogService : DialogService,
    private tokenStorage : TokenStorage,
    private notificationService : NotificationsService
  ) {
    this.assignOptions.push({label: this.translateService.instant("ASSIGN"), icon : 'pi pi-angle-double-down',command: (event) => this.assignGreenCard(this.selectedGreenCards) })

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
    if(this.filter.Status == 0){
      this.showCreated = true;
    }
    else{
      this.showCreated = false;
    }
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
  contextMenuSelected(event){
    this.assignOptions[0].disabled = false;
    let canAssign = false;
    this.selectedGreenCards.forEach(selectedGreenCard =>{
      if(selectedGreenCard.Status == GreenCardStatus.CreatedGreenCard)
      canAssign = true;
      if(selectedGreenCard.Status == GreenCardStatus.AssignedGreenCard)
      canAssign = false;
    })
    if(!canAssign){
      this.assignOptions[0].disabled = true;
    }
  }
  assignGreenCard(selectedGreenCards : GreenCard[]){
    const ref = this.dialogService.open(AgentsSearchComponent, {
      header: this.translateService.instant("SELECT_AGENT"),
      styleClass: 'popupAgent'
    });
    ref.onClose.subscribe((users: any) => {
      if (users) {
        let userGreenCardModel: any = {
          AssignTo: users.assignTo
        }
        let greenCards: number[] = new Array();
        selectedGreenCards.forEach(selectedGreenCard => {
          greenCards.push(selectedGreenCard.Id);
        })
        userGreenCardModel.GreenCards = greenCards;
        userGreenCardModel.UpdatedBy = parseInt(this.tokenStorage.getUserId());
        userGreenCardModel.Status = GreenCardStatus.AssignedGreenCard;
      this.greenCardService.AssignGreenCard(userGreenCardModel).then(x=>{
        if(x){
          this.notificationService.success("OBLIGATE_POLICY_NUMBERS","SUCCESSFULLY_ASSIGNED");
          this.refreshGreenCards();
          this.selectedGreenCards = new Array();
        }
      })
      }
    })
  }
  isGreenCardSelected(greenCard : GreenCard){
    if (this.selectedGreenCards != null) {
      let existingGreenCard = this.selectedGreenCards.find(x => x.Id == greenCard.Id && x.Number == greenCard.Number && x.AddedBy == greenCard.AddedBy);
      if (existingGreenCard != null)
        return true;
    }
    return false;
  }
}
