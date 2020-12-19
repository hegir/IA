import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AuthenticationService } from '../../../core/authentication.service';
import { TokenStorage } from '../../../core/tokenstorage.service';
import { User } from '../../../models/user';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {
  public config: PerfectScrollbarConfigInterface = {};
  fullName : string;
  username : string;

  constructor(private authenticationService: AuthenticationService,private router:Router,private activatedRoute:ActivatedRoute,
    private tokenStorage:TokenStorage){
      this.fullName = this.tokenStorage.getFullName();
      this.username = this.tokenStorage.getUsername();
    }


  logout(){
    this.authenticationService.logout();
  }
  openUserProfile(){
    this.router.navigate(["users/", this.tokenStorage.getUserId()]);
  }

}
