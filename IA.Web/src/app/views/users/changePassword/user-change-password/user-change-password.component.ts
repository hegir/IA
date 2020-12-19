import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { isNullOrUndefined } from 'util';
import { NotificationsService } from '../../../../core/notifications.service';
import { RequestService } from '../../../../core/request.service';
import { TokenStorage } from '../../../../core/tokenstorage.service';
import { ValidationService } from '../../../../core/validation.service';
import { PasswordChangeDto } from '../../../../dtos/passwordChange';
import { UsersService } from '../../../../services/users.service';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  providers: [UsersService, RequestService, ValidationService, TokenStorage, NotificationsService]
})
export class UserChangePasswordComponent implements OnInit {
  validationErrors: any = {};
  hide1 = true;
  hide2 = true;
  hide3 = true;
  passwordChange: PasswordChangeDto = new PasswordChangeDto();
  capsLockOn: boolean = false;
  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private usersService: UsersService,
    private validationsService: ValidationService,
    private notificationsService: NotificationsService,private tokenstorage:TokenStorage) { }

  ngOnInit() {
  }

  capsLock(event: any)
    {
      if(event.getModifierState("CapsLock"))
        this.capsLockOn = true;
      else
        this.capsLockOn = false;
    }

    save(form: FormGroup)
  {
    this.validationErrors = {};
    if(form.invalid)
    {
      this.validationErrors = this.validationsService.PrepareRequiredFieldErrors(form);
    }

    if(Object.keys(this.validationErrors).length > 0)
      return;
    let userId=this.tokenstorage.getUserId();
    this.passwordChange.UserId=parseInt(userId);
    if(this.passwordChange.Password != this.passwordChange.RepeatPassword)
    {
      this.notificationsService.danger("CHANGE_PASSWORD","PASSWORDS_DONT_MATCH");
      return;
    }
    if(this.passwordChange.Password == this.passwordChange.OldPassword)
    {
      this.notificationsService.danger("CHANGE_PASSWORD","PASSWORD_SAME_AS_OLD");
      return;
    }
    this.usersService.ChangePasswordPut(this.passwordChange).then(x=>{
      if(!isNullOrUndefined(x)){
      this.notificationsService.success("CHANGE_PASSWORD","PASSWORD_CHANGED_SUCCESSFULLY");
      this.ref.close();
      }
    });
  }

  close()
  {
    this.ref.close();
  }
}
