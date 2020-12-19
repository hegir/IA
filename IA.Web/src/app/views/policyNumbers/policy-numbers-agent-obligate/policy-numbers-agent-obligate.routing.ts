import { Routes } from "@angular/router";
import { PolicyNumbersAgentObligateComponent } from "./policy-numbers-agent-obligate.component";



export const PolicyNumbersAgentObligateRoutes:Routes=[
  {
    path: '',
    children: [
      {
        data:{
          reuseRoute : true,
        },
        path: '',
        component: PolicyNumbersAgentObligateComponent
      },
    ]
  }
];
