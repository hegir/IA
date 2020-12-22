import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";
import { AuthenticationService } from "./core/authentication.service";
import { RequestService } from "./core/request.service";
import { TranslationsService } from "./core/translations.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [TranslateService, TranslationsService, RequestService, AuthenticationService]
})
export class AppComponent implements OnInit{
  title = "app";
  
  constructor(private translationsService: TranslationsService,
    private translate: TranslateService,
    private authService : AuthenticationService) {
}
  ngOnInit()
  {
    this.translationsService.getTranslations(environment.defaultLanguage).toPromise().then(translations => {
      this.translate.addLangs([environment.defaultLanguage]);
      this.translate.setDefaultLang(environment.defaultLanguage);
      this.translate.use(environment.defaultLanguage);
      this.translate.setTranslation(environment.defaultLanguage, translations);
    });
    if(this.authService.isAuthorized() && this.authService.getFullName()){
      this.authService.forceRefreshToken();
    }
  }
}

