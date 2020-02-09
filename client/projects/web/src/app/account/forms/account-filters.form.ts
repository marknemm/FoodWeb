import { AccountReadRequest, AccountType } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';
export { AccountReadRequest };

export class AccountFiltersForm extends TypedFormGroup<AccountReadRequest> {

  constructor(filters?: Partial<AccountReadRequest>) {
    super({
      id: undefined,
      accountType: undefined,
      email: undefined,
      organizationName: undefined,
      sortBy: undefined,
      sortOrder: undefined,
      username: undefined
    });
    if (filters) {
      this.patchValue(filters);
    }
  }

  reset(value?: Partial<AccountReadRequest>, options?: { resetAccountType?: boolean, onlySelf?: boolean, emitEvent?: boolean }): void {
    const accountType: AccountType = this.get('accountType').value;
    super.reset(value, options);
    if (!options?.resetAccountType && !value?.accountType) {
      this.get('accountType').setValue(accountType);
    }
  }

}
