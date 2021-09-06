import { Component } from '@angular/core';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { Account, SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-hybrid-primary-settings',
  templateUrl: './primary-settings.component.html',
  styleUrls: ['./primary-settings.component.scss'],
  providers: formProvider(PrimarySettingsComponent)
})
export class PrimarySettingsComponent extends FormBaseComponent<AccountForm> {

  constructor(
    public sessionService: SessionService,
    private _accountSaveService: AccountSaveService,
    formHelperService: FormHelperService,
  ) {
    super(() => new AccountForm({ formMode: 'Account' }), formHelperService, true);
    this.formGroup.patchValue(this.sessionService.account);
  }

  get account(): Account {
    return this.sessionService.account;
  }

  get pageTitle(): string {
    return (this.sessionService.isBusiness ? 'Organization' : 'Account');
  }

  /**
   * Saves the primary settings.
   */
   save(): void {
    const subFormGroupName = (this.sessionService.isBusiness ? 'organization' : 'volunteer');
    if (this.formGroup.get(subFormGroupName).checkValidity()) {
      this._accountSaveService.updateAccountFields(
        this.sessionService.account,
        this.formGroup.toAccount(),
        [subFormGroupName]
      ).subscribe();
    }
  }

}
