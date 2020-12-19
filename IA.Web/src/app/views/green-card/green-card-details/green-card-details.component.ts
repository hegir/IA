import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GreenCard } from '../../../models/greenCard';
import { GreenCardService } from '../../../services/green-card.service';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ValidationService } from '../../../core/validation.service';
import { TokenStorage } from '../../../core/tokenstorage.service';
import { GreenCardStatus } from '../../../enums/greenCardStatus';
import { NotificationsService } from '../../../core/notifications.service';

@Component({
  selector: 'app-green-card-details',
  templateUrl: './green-card-details.component.html',
  providers : [GreenCardService,ValidationService]
})
export class GreenCardDetailsComponent implements OnInit {
greenCardId : string;
isNewGreenCard : boolean;
greenCard : GreenCard = new GreenCard();
greenCardfrom: any;
greenCardto: any;
greenCards : any = new Array();
greenCardsRange: boolean = false;
show:boolean = false;
public validationErrors : any;
  constructor(private route : ActivatedRoute,
    private greenCardsService : GreenCardService,
    private location : Location,
    private validationService : ValidationService,
    private tokenStorage : TokenStorage,
    private notificationsService : NotificationsService,
    private router : Router) {
    this.greenCardId = this.route.snapshot.paramMap.get("id");
    this.isNewGreenCard = this.greenCardId == "0";
    if(!this.isNewGreenCard){
      this.greenCardsService.FindById(this.greenCardId).then(x=>{
        if(x != null){
          this.greenCard = x;
        }
      })
    }
  }

  ngOnInit() {
    this.greenCard.Price = 4;
  }
  back(){
    this.location.back();
  }
  showRange(event) {
    if (event.checked) {
      this.greenCard.Number = null;
      this.show = true;
    }
    else {
      this.show = false;
    }
  }
  add(form: FormGroup) {
    this.validationErrors = {};
    if (form.invalid) {
      this.validationErrors = this.validationService.PrepareRequiredFieldErrors(form);
    }
    else {
      if(this.greenCardfrom >= this.greenCardto){
        this.notificationsService.danger("GREEN_CARDS","GREEN_CARDS_NUMBER_FROM_CANNOT_BE_HIGHER_THAN_GREEN_CARDS_NUMBER_TO");
        return;
      }
      if (this.isNewGreenCard) {
        if (this.greenCard.Number == null || this.greenCard.Price == null) {
          for (let index = this.greenCardfrom; index <= this.greenCardto; index++) {
            this.greenCards.push(index);
          }
            this.greenCards.sort();
          this.greenCards.forEach(card => {
            let greenCard = new GreenCard();
            greenCard.Status = GreenCardStatus.CreatedGreenCard;
            greenCard.Number = card.toString();
            greenCard.Price = this.greenCard.Price;
            this.greenCardsService.Save(greenCard).then(x => {
              if (x != null) {
                greenCard = x;
              }
            });
          })
          this.notificationsService.success("GREEN_CARDS", "ADDED_SUCCESSFULLY");
          this.router.navigate(['greencards']);
          return;
        }
        this.greenCard.Status = GreenCardStatus.CreatedGreenCard;
        this.greenCardsService.Save(this.greenCard).then(x => {
          if (x != null) {
            this.greenCard = x;
            this.notificationsService.success("GREEN_CARDS", "ADDED_SUCCESSFULLY");
            this.router.navigate(['greencards']);
          }
        })
      }
          else {
            this.greenCardsService.Save(this.greenCard).then(x => {
              if (x != null) {
                this.greenCard = x;
                this.notificationsService.success("GREEN_CARDS", "UPDATED_SUCCESSFULLY");
                this.router.navigate(['greencards']);
              }
            })
          }
    }
  }
}
