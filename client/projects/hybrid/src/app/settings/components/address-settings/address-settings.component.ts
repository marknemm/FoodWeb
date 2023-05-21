import { Component } from '@angular/core';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { AccountForm } from '~web/account-shared/services/account-form-adapter/account-form-adapter.service';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-address-settings',
  templateUrl: './address-settings.component.html',
  styleUrls: ['./address-settings.component.scss'],
  providers: [FormFieldService]
})
export class AddressSettingsComponent {

  constructor(
    private _accountSaveService: AccountSaveService,
    private _formFieldService: FormFieldService<AccountForm>,
    private _sessionService: SessionService,
  ) {
    this._formFieldService.registerControl(new AccountForm({ formMode: 'Account' }));
    this.accountForm.patchValue(this._sessionService.account);
  }

  get accountForm(): AccountForm {
    return this._formFieldService.control;
  }

  /**
   * Saves the address settings.
   */
  save(): void {
    this.accountForm.get('contactInfo').markAllAsTouched();
    if (this.accountForm.get('contactInfo').valid) {
      this._accountSaveService.updateAccountFields(
        this._sessionService.account,
        this.accountForm.toAccount(),
        ['contactInfo']
      ).subscribe();
    }
  }

}
