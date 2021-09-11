import { Component } from '@angular/core';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { FormFieldService } from '~web/forms';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-hybrid-operation-hours-settings',
  templateUrl: './operation-hours-settings.component.html',
  styleUrls: ['./operation-hours-settings.component.scss'],
  providers: [FormFieldService]
})
export class OperationHoursSettingsComponent {

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
   * Saves the operation hours settings.
   */
  save(): void {
    this.accountForm.get('operationHours').markAllAsTouched();
    if (this.accountForm.get('operationHours').valid) {
      this._accountSaveService.updateAccountFields(
        this._sessionService.account,
        this.accountForm.toAccount(),
        ['operationHours']
      ).subscribe();
    }
  }

}
