import { Component, Input } from '@angular/core';
import { AccountType } from '~shared';
import { FormComponentBase, valueAccessorProvider } from '~web/data-structure/form-component-base';
import { ConstantsService } from '~web/shared/constants/constants.service';
import { FormHelperService } from '~web/shared/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss'],
  providers: valueAccessorProvider(AccountTypeComponent)
})
export class AccountTypeComponent extends FormComponentBase<AccountType> {

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
