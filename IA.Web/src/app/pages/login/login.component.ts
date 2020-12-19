import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/authentication.service';
import { RequestService } from '../../core/request.service';
import { FormGroup} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ValidationService } from '../../core/validation.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [AuthenticationService,RequestService,ValidationService,RequestService,UsersService]
})
export class LoginComponent implements OnInit {
username: string;
password: string;
public validationErrors:any={};

  constructor(private router:Router,
              private route:ActivatedRoute,
              private authService:AuthenticationService,
              private validationService: ValidationService,
              private usersService: UsersService) { }

  ngOnInit() {
   document.getElementById("Username").focus();

   this.route.queryParams.subscribe((params :Params) =>{
     if(params != null && params['tokens'] != null && params['tokens'] != ''){
       this.authService.loginWithRefreshToken(params['tokens']).then(res =>{
         if(this.authService.isAuthorized()){
           this.router.navigate(['/dashboard']);
         }
       })
     }
   })
  }

 Login(form : FormGroup):void{
   this.validationErrors={};
   if(form.invalid){
     this.validationErrors=this.validationService.PrepareRequiredFieldErrors(form);
   }
   else{
     this.username = this.username.trim();
     this.authService.login(this.username,this.password)
     .then( res =>{
       this.authService.isAuthorized().toPromise().then(x =>{
         if(x){
           this.usersService.GetPermissions().then(permissions =>{
            this.router.navigated=false;
            this.router.navigate(['/dashboard'])
           })
         }
       })
     })
   }
 }
}
