import { Routes } from "@angular/router";
import { GreenCardsObligateComponent } from "./green-cards-obligate.component";



export const GreenCardsObligateRoutes:Routes=[
  {
    path: '',
    children: [
      {
        path: '',
        component: GreenCardsObligateComponent
      }
    ]
  }
];
