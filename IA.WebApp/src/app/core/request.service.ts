import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { SpinnerService } from "./spinner.service";
import "rxjs/add/operator/share";
import 'rxjs/add/operator/map'
import { empty, Observable, observable } from "rxjs";
import * as moment from 'moment';
import { environment } from "../../environments/environment";
import 'rxjs/Rx';
import { NotificationsService } from "./notifications.service";
import { isObject } from "util";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class RequestService {
    private _options: any = {}

    constructor(
        private http: HttpClient,
        private spinnerService: SpinnerService,
        private notificationService: NotificationsService,
        private authenticationService : AuthenticationService
    ) { }

    public get(path: string, params: any =  null, cached: boolean = false, cacheExpireTime: number = null): Observable<any> {
        this.spinnerService.showSpinner();
        this._options.params = this.buildHttpParams(params);
        return this.http.get(environment.apiEndpoint.concat(path), this._options)
            .share()
            .map((response: any) => {
                this.spinnerService.removeSpinner();
                var response = this.handleResponse(response);
                if (cached) {
                    var options = null;
                    if (cacheExpireTime != null) {
                        options = { expires: Date.now() + 1000 * 60 * cacheExpireTime };
                    }
                }
                return response;
            })
            .catch((error: any) => {
                this.spinnerService.removeSpinner();
                return this.handleError(error);
            })
    }

    public post(path: string, body: any, xmlContent: boolean = false): Observable<Object> {
        this.spinnerService.showSpinner();
        var options: {};
        if (xmlContent) {
            options = {
                headers: new HttpHeaders({
                    'Accept': 'application/xml',
                    'Response-Type': 'text'
                }),
                responseType: 'text'
            }
        }
        return this.http.post(environment.apiEndpoint.concat(path), body, options)
            .share()
            .map((response: any) => {
                this.spinnerService.showSpinner();
                return this.handleResponse(response);
            })
            .catch((error: any) => {
                this.spinnerService.removeSpinner();
                return this.handleError(error);
            })
    }

    public delete(path: string, data: any = null): Observable<Object> {
        this._options.body = data;
        this.spinnerService.showSpinner();
        return this.http.delete(environment.apiEndpoint.concat(path), this._options)
            .share()
            .map((response: any) => {
                this.spinnerService.removeSpinner();
                return this.handleResponse(response);
            })
            .catch((error: any) => {
                this.spinnerService.removeSpinner();
                return this.handleError(error);
            })
    }

    public put(path: string, body: any, xmlContent: boolean = false): Observable<Object> {
      this.spinnerService.showSpinner();
      var options: {};
      if (xmlContent) {
          options = {
              headers: new HttpHeaders({
                  'Accept': 'application/xml',
                  'Response-Type': 'text'
              }),
              responseType: 'text'
          }
      }
      return this.http.put(environment.apiEndpoint.concat(path), body, options)
          .share()
          .map((response: any) => {
              this.spinnerService.showSpinner();
              return this.handleResponse(response);
          })
          .catch((error: any) => {
              this.spinnerService.removeSpinner();
              return this.handleError(error);
          })
  }


    public handleResponse(response: any): any {
        if (response != null) {
            return JSON.parse(JSON.stringify(response), this.dateFormater);
        }
        return response;
    }

    public handleError(error: any): Observable<any> {
        switch (error.status) {
            case 400:
                if (error.error.hasOwnProperty("ModelState"))
                    return Observable.throw(error.error.title);
                if (error.error.hasOwnProperty("Message")) {
                    this.notificationService.danger(error.error.Message);
                    return Observable.empty();
                }
                if (error.error != null) {
                    console.log(error);
                    if (isObject(error.error)) {
                        let valError = error.error[Object.keys(error.error)[0]]
                        this.notificationService.danger(valError[0]);
                    }
                    else
                        this.notificationService.danger(error.error);
                    return empty();
                }
                this.notificationService.danger(error.error);
                return empty();
            case 0:
                this.notificationService.danger("YOU_DONT_HAVE_PERMISSIONS");
                return empty();
            case 403:
                this.notificationService.danger("YOU_DONT_HAVE_PERMISSIONS");
                return empty();
            case 401:
                this.authenticationService.logout();
                return empty();
            default:
                this.notificationService.danger(error.statusText);
                return empty();
        }
    }

    public dateFormater(key, value): Date {
        var a;
        if (typeof value === 'string') {
            a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
            if (a) {
                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
        }
        return value;
    }


    public buildHttpParams(data: any): HttpParams {
        let params = new HttpParams();
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key] instanceof Date) {
                    params = params.append(key, moment(data[key]).format('YYYY-MM-DDTHH:mm:ss'))
                }
                if (data[key] instanceof Array) {
                    data[key].foreach(element => {
                        params = params.append(key, element)
                    })
                }
                else {
                    params = params.append(key, data[key])
                }
            }
        }
        return params;
    }
}
