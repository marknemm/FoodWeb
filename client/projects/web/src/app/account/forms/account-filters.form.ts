import { AccountReadRequest, AccountType, OperationHours } from '~shared';
import { OperationHoursForm } from '~web/account/operation-hours.form';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';
export { AccountReadRequest };

export class AccountFiltersForm extends TypedFormGroup<AccountFiltersFormT> {

  constructor(filters?: Partial<AccountFiltersFormT>) {
    super({
      id: undefined,
      accountType: undefined,
      email: undefined,
      fullTextQuery: undefined,
      operationHours: new OperationHoursForm(undefined, true),
      organizationName: undefined,
      signedAgreement: undefined,
      sortBy: undefined,
      sortOrder: undefined,
      username: undefined,
      verified: undefined,
      volunteerFirstName: undefined,
      volunteerLastName: undefined
    });
    if (filters) {
      this.patchValue(filters);
    }
  }

  /**
   * Converts the contained form value to a valid AccountReadRequest.
   * @return The converted AccountReadRequest.
   */
  toAccountReadRequest(): AccountReadRequest {
    const value: AccountFiltersFormT = this.value;
    if (value.operationHours) {
      value.operationHoursWeekday = value.operationHours.weekday;
      value.operationHoursStartTime = value.operationHours.startTime;
      value.operationHoursEndTime = value.operationHours.endTime;
      delete value.operationHours;
    }
    return value;
  }

  /**
   * @override
   */
  patchValue(value: Partial<AccountFiltersFormT>, options?: { onlySelf?: boolean, emitEvent?: boolean }): void {
    value = this._fillOperationHoursForm(value);
    super.patchValue(value, options);
  }

  /**
   * @override
   */
  reset(value?: Partial<AccountFiltersFormT>, options?: { resetAccountType?: boolean, onlySelf?: boolean, emitEvent?: boolean }): void {
    const accountType: AccountType = this.get('accountType').value;
    value = this._fillOperationHoursForm(value);
    super.reset(value, options);
    // Only allow the input value to update the account type if specified in options argument.
    // This is so that a page such as 'Donors' or 'Receivers' will continue to filter by its designated accountType by default.
    if (!options?.resetAccountType && !value?.accountType) {
      this.get('accountType').setValue(accountType);
    }
  }

  /**
   * @override
   */
  setValue(value: Partial<AccountFiltersFormT>, options?: { onlySelf?: boolean, emitEvent?: boolean }): void {
    value = this._fillOperationHoursForm(value);
    super.setValue(value, options);
  }

  /**
   * Fills the operation hours of a given value with the flattened version (for the purpose of GET/url-query parameterization).
   * Required so that operation hours filter parameters may fit the structure of the OperationHoursForm.
   * @param value The value to fill the operation hours of.
   * @return A copy of the input value with operation hours filled.
   */
  private _fillOperationHoursForm(value?: Partial<AccountFiltersFormT>): Partial<AccountFiltersFormT> {
    if (value) {
      const valueCopy = Object.assign({}, value);
      valueCopy.operationHours = {};
      if (valueCopy.operationHoursWeekday) {
        valueCopy.operationHours.weekday = valueCopy.operationHoursWeekday
      }
      if (valueCopy.operationHoursStartTime) {
        valueCopy.operationHours.startTime = valueCopy.operationHoursStartTime;
      }
      if (valueCopy.operationHoursEndTime) {
        valueCopy.operationHours.endTime = valueCopy.operationHoursEndTime;
      }
      return valueCopy;
    }
    return value;
  }

}

export interface AccountFiltersFormT extends AccountReadRequest {
  operationHours?: Partial<OperationHours>;
}
