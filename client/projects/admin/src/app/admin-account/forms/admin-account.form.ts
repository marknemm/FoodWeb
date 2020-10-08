import { Observable } from 'rxjs';
import { Account } from '~shared';
import { AccountForm, AccountFormConfig, AccountFormT, PasswordFormT } from '~web/account-shared/forms/account.form';
import { TFormGroup } from '~web/data-structure/t-form-group';
export { PasswordFormT };

export class AdminAccountForm extends TFormGroup<AdminAccountFormT> {

  constructor(config: AccountFormConfig, destroy$: Observable<any>) {
    super({
      account: new AccountForm(config, destroy$),
      accountCreateOptions: new TFormGroup<AccountCreateOptions>({
        autoGenPassword: false,
        autoVerify: false
      })
    });
  }

  get accountForm(): AccountForm {
    return <AccountForm>this.get('account');
  }

  get accountCreateOptionsForm(): TFormGroup<AccountCreateOptions> {
    return <TFormGroup<AccountCreateOptions>>this.get('accountCreateOptions');
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
  account: AccountFormT;
  accountCreateOptions: AccountCreateOptions;
}

export interface AccountCreateOptions {
  autoGenPassword: boolean;
  autoVerify: boolean;
}
