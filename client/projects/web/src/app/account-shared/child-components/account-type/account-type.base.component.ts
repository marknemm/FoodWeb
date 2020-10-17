import { Component, Input } from '@angular/core';
import { AccountType } from '~shared';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { TFormControl } from '~web/data-structure/t-form-control';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

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
