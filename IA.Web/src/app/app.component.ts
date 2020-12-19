import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslationsService } from './core/translations.service';
import { environment } from '../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './core/authentication.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers:[TranslationsService]
})
export class AppComponent implements OnInit {

  constructor(private translationsService: TranslationsService,
              private translate: TranslateService,
              private authService : AuthenticationService) {
  }

  ngOnInit(){

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
