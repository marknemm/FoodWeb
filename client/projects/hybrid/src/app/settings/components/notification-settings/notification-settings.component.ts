import { Component } from '@angular/core';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-hybrid-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
  providers: formProvider(NotificationSettingsComponent)
})
export class NotificationSettingsComponent extends FormBaseComponent<AccountForm> {

  constructor(
    public sessionService: SessionService,
    private _accountSaveService: AccountSaveService,
    formHelperService: FormHelperService,
  ) {
    super(() => new AccountForm({ formMode: 'Account' }), formHelperService, true);
    this.formGroup.patchValue(this.sessionService.account);
  }

  /**
   * Saves the notification settings.
   */
   save(): void {
    if (this.formGroup.get('notificationSettings')) {
      this._accountSaveService.updateAccountFields(
        this.sessionService.account,
        this.formGroup.toAccount(),
        ['notificationSettings']
      ).subscribe();
    }
  }

}
