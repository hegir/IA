import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/Rx';

@Injectable()
export class TranslationsService {
    constructor(private http: Http) { }

    private result: Object;

    getTranslations(languageId:string = environment.defaultLanguage) {
        return this.http.get(`/assets/i18n/${languageId}.json`).map(res => {
            this.result = res.json();
            return <string>this.result;
        });
    }
}
