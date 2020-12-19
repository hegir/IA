import { Component, OnInit } from '@angular/core';
import { User } from '../../../../models/user';
import { UsersService } from '../../../../services/users.service';
import { DynamicDialogRef } from 'primeng/api';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-agents-search',
  templateUrl: './agents-search.component.html',
  providers: [UsersService]
})
export class AgentsSearchComponent implements OnInit {
agents : User[] = new Array();
selectedAgent: number = null;

  constructor(private usersService : UsersService,private ref : DynamicDialogRef) {
    this.usersService.FindAllAgents().then(x=>{
      if(x != null){
        this.agents = x.sort((a,b)=>{
          return (a.FullName.localeCompare(b.FullName,environment.defaultLanguage))
        })
      }
    })
   }

  ngOnInit() {
  }

  assign(user: User) {
    if (this.selectedAgent == user.Id)
      this.selectedAgent = null;
    else
      this.selectedAgent = user.Id;
  }

  save(){
    let data : any={
      assignTo: this.selectedAgent
    }
    this.ref.close(data);
  }
}
