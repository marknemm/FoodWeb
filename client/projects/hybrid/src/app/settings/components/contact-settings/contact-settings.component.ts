import { Component } from '@angular/core';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-contact-settings',
  templateUrl: './contact-settings.component.html',
  styleUrls: ['./contact-settings.component.scss'],
  providers: formProvider(ContactSettingsComponent)
})
export class ContactSettingsComponent extends FormBaseComponent<AccountForm> {

  constructor(
    private _accountSaveService: AccountSaveService,
    private _sessionService: SessionService,
    formHelperService: FormHelperService,
  ) {
    super(() => new AccountForm({ formMode: 'Account' }), formHelperService, true);
    this.formGroup.patchValue(this._sessionService.account);
  }

  /**
   * Saves the contact settings.
   */
  save(): void {
    if (this.formGroup.get('contactInfo').checkValidity()) {
      this._accountSaveService.updateAccountFields(
        this._sessionService.account,
        this.formGroup.toAccount(),
        ['contactInfo']
      ).subscribe();
    }
  }

}
