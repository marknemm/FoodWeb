import { Component } from '@angular/core';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { FormFieldService } from '~web/forms';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-hybrid-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
  providers: [FormFieldService]
})
export class NotificationSettingsComponent {

  constructor(
    public sessionService: SessionService,
    private _formFieldService: FormFieldService<AccountForm>,
    private _accountSaveService: AccountSaveService,
  ) {
    this._formFieldService.registerControl(new AccountForm({ formMode: 'Account' }));
    this.accountForm.patchValue(this.sessionService.account);
  }

  get accountForm(): AccountForm {
    return this._formFieldService.control;
  }

  /**
   * Saves the notification settings.
   */
  save(): void {
    this.accountForm.get('contactInfo').markAllAsTouched();
    if (this.accountForm.get('contactInfo').valid) {
      this._accountSaveService.updateAccountFields(
        this.sessionService.account,
        this.accountForm.toAccount(),
        ['contactInfo']
      ).subscribe();
    }
  }

}
