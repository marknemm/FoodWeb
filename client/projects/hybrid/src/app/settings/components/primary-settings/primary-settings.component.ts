import { Component } from '@angular/core';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { FormFieldService } from '~web/forms';
import { Account, SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-hybrid-primary-settings',
  templateUrl: './primary-settings.component.html',
  styleUrls: ['./primary-settings.component.scss'],
  providers: [FormFieldService]
})
export class PrimarySettingsComponent {

  constructor(
    public sessionService: SessionService,
    private _accountSaveService: AccountSaveService,
    private _formFieldService: FormFieldService<AccountForm>,
  ) {
    this._formFieldService.registerControl(new AccountForm({ formMode: 'Account' }));
    this.accountForm.patchValue(this.sessionService.account);
  }

  get account(): Account {
    return this.sessionService.account;
  }

  get accountForm(): AccountForm {
    return this._formFieldService.control;
  }

  get pageTitle(): string {
    return (this.sessionService.isBusiness ? 'Organization' : 'Account');
  }

  /**
   * Saves the primary settings.
   */
   save(): void {
    const subFormGroupName = (this.sessionService.isBusiness ? 'organization' : 'volunteer');
    this.accountForm.get(subFormGroupName).markAllAsTouched();
    if (this.accountForm.get(subFormGroupName).valid) {
      this._accountSaveService.updateAccountFields(
        this.sessionService.account,
        this.accountForm.toAccount(),
        [subFormGroupName]
      ).subscribe();
    }
  }

}
