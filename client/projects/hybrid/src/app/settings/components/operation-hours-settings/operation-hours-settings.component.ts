import { Component } from '@angular/core';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-hybrid-operation-hours-settings',
  templateUrl: './operation-hours-settings.component.html',
  styleUrls: ['./operation-hours-settings.component.scss'],
  providers: formProvider(OperationHoursSettingsComponent)
})
export class OperationHoursSettingsComponent extends FormBaseComponent<AccountForm> {

  constructor(
    private _accountSaveService: AccountSaveService,
    private _sessionService: SessionService,
    formHelperService: FormHelperService,
  ) {
    super(() => new AccountForm({ formMode: 'Account' }), formHelperService, true);
    this.formGroup.patchValue(this._sessionService.account);
  }

  /**
   * Saves the operation hours settings.
   */
   save(): void {
    if (this.formGroup.get('operationHours').checkValidity()) {
      this._accountSaveService.updateAccountFields(
        this._sessionService.account,
        this.formGroup.toAccount(),
        ['operationHours']
      ).subscribe();
    }
  }

}
