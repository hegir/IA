import { Injectable } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import { MatSnackBar } from "@angular/material";



type Severities = 'success' | 'info' | 'warning' | 'danger';
let $: any=jQuery;

@Injectable()
export class NotificationsService{
constructor(
    private translate : TranslateService,
    private _snackBar : MatSnackBar
){}

success(title: string,message: string){
    this.showNotification('success',this.translate.instant(title),this.translate.instant(message));
}
info(title : string,message:string){
    this.showNotification('info',this.translate.instant(title),this.translate.instant(message))
}
warning(title : string,message : string){
    this.showNotification('warning',this.translate.instant(title),this.translate.instant(message))
}
danger(title : string,message: string){
    this.showNotification('danger',this.translate.instant(title),this.translate.instant(message))
}
snackBar(message : string){
    this._snackBar.open(this.translate.instant(message),null,{
        duration : 2000,
        panelClass: 'center'
    })
}

private showNotification(severity: string, title: string, message: string) {
    $.notify({
      icon: 'glyphicon glyphicon-warning-sign',
      title: this.translate.instant(title),
      message: this.translate.instant(message)
    },
      {
        type: severity,
        timer: 3000,
        placement: {
          from: 'top',
          align: 'right'
        },
        icon_type: 'class',
        template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
		'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
		'<i class="material-icons" style="position:absolute" data-notify="icon">notifications</i> ' +
		'<span data-notify="title" style="margin-left:30px"><strong>{1}</strong></span> <br/> ' +
		'<span data-notify="message" style="margin-left:30px">{2}</span>' +
		'<div class="progress" data-notify="progressbar">' +
			'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
		'</div>' +
		'<a href="{3}" target="{4}" data-notify="url"></a>' +
	'</div>'
      });
  }
}

