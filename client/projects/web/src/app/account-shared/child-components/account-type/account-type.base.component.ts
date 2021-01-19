import { Component, Input } from '@angular/core';
import { AccountType } from '~shared';
import { Convert } from '~web/component-decorators';
import { FormBaseComponent, FormHelperService, TFormControl } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({ template: '' })
export abstract class AccountTypeBaseComponent extends FormBaseComponent<AccountType> {

  readonly AccountType = AccountType;

  @Convert()
  @Input() editable = false;

  constructor(
    public constantsService: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(() => new TFormControl<AccountType>(), formHelperService);
  }

  accountTypeClick(accountType: AccountType): void {
    if (this.editable) {
      this.formControl.setValue(accountType);
    }
  }
}
