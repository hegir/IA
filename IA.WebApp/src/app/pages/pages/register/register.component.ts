import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationsService } from "src/app/core/notifications.service";
import { RequestService } from "src/app/core/request.service";
import { ValidationService } from "src/app/core/validation.service";
import { User } from "src/app/models/user";
import { UsersService } from "src/app/services/users.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
  providers: [UsersService,
  RequestService,
  NotificationsService,
  ValidationService]
})
export class RegisterComponent implements OnInit, OnDestroy {
  user: User = new User();
  agreedTerms: boolean = false;

  @ViewChild('registerForm') registerForm;
  public validationErrors: any;

  constructor(private usersService: UsersService,
    private notificationsService: NotificationsService,
    private router: Router,
    private validationService: ValidationService) {}

  ngOnInit() {
    var $page = document.getElementsByClassName("full-page")[0];
    var image_container = document.createElement("div");
    image_container.classList.add("full-page-background");
    $page.classList.add("register-page");
    image_container.style.backgroundImage = "url(assets/img/bg16.jpg)";
    $page.appendChild(image_container);
  }
  ngOnDestroy() {
    var $page = document.getElementsByClassName("full-page")[0];
    $page.classList.remove("register-page");
  }

  register()
  {
    this.validationErrors = {};
    if (this.registerForm.invalid) {
      this.validationErrors = this.validationService.PrepareRequiredFieldErrors(this.registerForm);
      console.log(this.validationErrors);
      return;
    }

    this.usersService.Save(this.user).then(x =>{
      if(x != null)
        {
          this.notificationsService.success("Successfully registered, please login");
          this.router.navigate(['pages/login']);
        }
    })
  }
}
