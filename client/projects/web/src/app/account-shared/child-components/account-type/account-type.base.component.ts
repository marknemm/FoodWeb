import { Component, Input } from '@angular/core';
import { AccountType } from '~shared';
import { FormBaseComponent, FormHelperService, TFormControl } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({ template: '' })
export abstract class AccountTypeBaseComponent extends FormBaseComponent<AccountType> {

  readonly AccountType = AccountType;

  @Input() editable = false;

  constructor(
    public constantsService: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(new TFormControl<AccountType>(), formHelperService);
  }

  accountTypeClick(accountType: AccountType): void {
    if (this.editable) {
      this.formControl.setValue(accountType);
    }
  }
}
