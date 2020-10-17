import { Pipe, PipeTransform } from '@angular/core';
import { Account, AccountAutocompleteItem, AccountHelper } from '~shared';

@Pipe({
  name: 'foodwebAccountName'
})
export class AccountNamePipe implements PipeTransform {

  constructor(
    private _accountHelper: AccountHelper
  ) {}

  transform(account: Account | AccountAutocompleteItem): string {
    return this._accountHelper.accountName(account);
  }

}
