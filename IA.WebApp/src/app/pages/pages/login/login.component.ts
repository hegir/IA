import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/core/authentication.service";
import { ValidationService } from "src/app/core/validation.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  providers: [AuthenticationService, ValidationService,]
})
export class LoginComponent implements OnInit, OnDestroy {
  private focus;
  private focus2;
  @ViewChild('loginForm') loginForm;
  public validationErrors: any;
  username: string;
  password: string;

  constructor(
    private router: Router,
    private validationService: ValidationService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    var $page = document.getElementsByClassName("full-page")[0];
    var image_src;
    var image_container = document.createElement("div");
    image_container.classList.add("full-page-background");
    image_container.style.backgroundImage = "url(assets/img/bg14.jpg)";
    $page.appendChild(image_container);
    $page.classList.add("login-page");

  }
  ngOnDestroy() {
    var $page = document.getElementsByClassName("full-page")[0];
    $page.classList.remove("login-page");
  }

  navigateToRegistration()
  {
    console.log('huha');
    this.router.navigate(['pages/register'])
  }

  login(){
    this.validationErrors={};
    if(this.loginForm.invalid){
      this.validationErrors=this.validationService.PrepareRequiredFieldErrors(this.loginForm);
    }
    else{
      this.username = this.username.trim();
      this.authService.login(this.username,this.password)
      .then( res =>{
        this.authService.isAuthorized().toPromise().then(x =>{
          if(x){
            // this.usersService.GetPermissions().then(permissions =>{
            //  this.router.navigated=false;
            //  this.router.navigate(['/dashboard'])
            // })
          }
        })
      })
    }
  }
}
