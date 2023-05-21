import { FormGroup } from '@angular/forms';
import { Account } from '~shared';
import { AccountForm, AccountFormConfig, AccountFormData, PasswordFormData } from '~web/account-shared/forms/account.form';
export { PasswordFormData };

export class AdminAccountForm extends FormGroup<AdminAccountFormT> {

  constructor(config: AccountFormConfig) {
    super({
      account: new AccountForm(config),
      accountCreateOptions: new FormGroup<AccountCreateOptions>({
        autoGenPassword: false,
        autoVerify: false
      })
    });
  }

  get accountForm(): AccountForm {
    return this.get('account') as AccountForm;
  }

  get accountCreateOptionsForm(): FormGroup<AccountCreateOptions> {
    return this.get('accountCreateOptions') as FormGroup<AccountCreateOptions>;
  }

  get accountCreateOptions(): AccountCreateOptions {
    return this.get('accountCreateOptions').value;
  }

  get password(): string {
    return this.accountForm.password;
  }

  toAccount(): Account {
    return this.accountForm.toAccount();
  }

}

export interface AdminAccountFormT {
  account: AccountFormData;
  accountCreateOptions: AccountCreateOptions;
}

export interface AccountCreateOptions {
  autoGenPassword: boolean;
  autoVerify: boolean;
}
