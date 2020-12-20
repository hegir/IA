import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from "ngx-toastr";
@Injectable()
export class NotificationsService {

  constructor(private translate: TranslateService, private toastr: ToastrService) {
  }
  success(message: string) {
    this.showNotification('success', this.translate.instant(message));
  }
  info(message: string) {
    this.showNotification('info', this.translate.instant(message));
  }
  warning(message: string) {
    this.showNotification('warning', this.translate.instant(message));
  }
  danger(message: string) {
    this.showNotification('danger', this.translate.instant(message));
  }

  private showNotification(severity: string, message: string) {
    this.toastr.show(
      '<span class="now-ui-icons ui-1_bell-53"></span>', message,
      {
        timeOut: 4000,
        closeButton: true,
        enableHtml: true,
        toastClass: `alert alert-${severity} alert-with-icon`,
        positionClass: "toast-top-right"
      }
    );
  }
}