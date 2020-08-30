import { Component, Input } from '@angular/core';
import { AccountType } from '~shared';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export abstract class AccountTypeBaseComponent extends FormBaseComponent<AccountType> {

  readonly AccountType = AccountType;

  @Input() editing = false;

  constructor(
    public constantsService: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }

  accountTypeClick(accountType: AccountType): void {
    if (this.editing) {
      this.formControl.setValue(accountType);
    }
  }
}
