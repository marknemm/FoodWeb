import { Component } from '@angular/core';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { FormFieldService } from '~web/forms';
import { PasswordForm } from '~web/password/forms/password.form';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-hybrid-password-settings',
  templateUrl: './password-settings.component.html',
  styleUrls: ['./password-settings.component.scss'],
  providers: [FormFieldService]
})
export class PasswordSettingsComponent {

  constructor(
    private _accountSaveService: AccountSaveService,
    private _formFieldService: FormFieldService<PasswordForm>,
    private _sessionService: SessionService,
  ) {
    this._formFieldService.registerControl(new PasswordForm({ formMode: 'Account' }));
  }

  get passwordForm(): PasswordForm {
    return this._formFieldService.control;
  }

  /**
   * Saves the password settings.
   */
  save(): void {
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.valid) {
      this._accountSaveService.updatePassword(
        this._sessionService.account,
        this.passwordForm.value
      ).subscribe();
    }
  }

}
