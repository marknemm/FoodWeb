import { Component } from '@angular/core';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { PasswordForm } from '~web/password/forms/password.form';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-hybrid-password-settings',
  templateUrl: './password-settings.component.html',
  styleUrls: ['./password-settings.component.scss'],
  providers: formProvider(PasswordSettingsComponent)
})
export class PasswordSettingsComponent extends FormBaseComponent<PasswordForm> {

  constructor(
    private _accountSaveService: AccountSaveService,
    private _sessionService: SessionService,
    formHelperService: FormHelperService,
  ) {
    super(() => new PasswordForm({ formMode: 'Account' }), formHelperService, true);
  }

  /**
   * Saves the password settings.
   */
   save(): void {
    if (this.formGroup.get('password').checkValidity()) {
      this._accountSaveService.updatePassword(
        this._sessionService.account,
        this.formGroup.value
      ).subscribe();
    }
  }

}
