import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Form } from '@angular/forms';

@Injectable()
export class ValidationService {
  constructor(private translateService: TranslateService) { }

  PrepareRequiredFieldErrors(form: FormGroup) {
    let errors = {};
    for (let key in form.controls) {
      if (!form.controls[key].valid) {
        errors[key] = new Array();
        for (let errorKey in form.controls[key].errors) {
          switch (errorKey) {
            case 'required':
              var field = this.translateService.instant(key.toUpperCase());
              var myStr = this.translateService.instant("REQUIRED") as string;
              errors[key].push(myStr.replace("{0}", field));
              break;
            case 'email':
              errors[key].push(this.translateService.instant("WRONG_EMAIL_ADRESS"));
              break;
            case 'minlength':
              var requiredLength = form.controls[key].errors[errorKey].requiredLength;
              errors[key].push(this.translateService.instant("MIN_LENGTH").concat(`${requiredLength}`))
              break;
            case 'maxlength':
              var requiredLength = form.controls[key].errors[errorKey].requiredLength;
              errors[key].push(this.translateService.instant("MAX_LENGTH").concat(`${requiredLength}`));
              break;
            case 'pattern':
              errors[key].push(this.translateService.instant("INVALID_FORMAT"));
              break;
            case 'minNumber':
              var minValue = form.controls[key].errors[errorKey].minValue;
              errors[key].push(this.translateService.instant("MIN_VALUE").concat(`${minValue}`));
              break;
        }
      }
    };
  }
  return errors;
  }
}
