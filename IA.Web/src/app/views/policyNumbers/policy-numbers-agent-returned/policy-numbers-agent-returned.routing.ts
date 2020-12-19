import { Routes } from "@angular/router";
import { PolicyNumbersAgentReturnedComponent } from "./policy-numbers-agent-returned.component";



export const PolicyNumbersAgentReturnedRoutes:Routes=[
  {
    path: '',
    children: [
      {
        data:{
          reuseRoute : true,
        },
        path: '',
        component: PolicyNumbersAgentReturnedComponent
      },
    ]
  }
];
