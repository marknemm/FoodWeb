import { Component } from '@angular/core';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-address-settings',
  templateUrl: './address-settings.component.html',
  styleUrls: ['./address-settings.component.scss'],
  providers: formProvider(AddressSettingsComponent)
})
export class AddressSettingsComponent extends FormBaseComponent<AccountForm> {

  constructor(
    private _accountSaveService: AccountSaveService,
    private _sessionService: SessionService,
    formHelperService: FormHelperService,
  ) {
    super(() => new AccountForm({ formMode: 'Account' }), formHelperService, true);
    this.formGroup.patchValue(this._sessionService.account);
  }

  /**
   * Saves the address settings.
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
