import { AccountReadRequest, AccountType, OperationHours } from '~shared';
import { OperationHoursFilterForm } from '~web/account-shared/forms/operation-hours-filter.form';
import { ListFiltersForm } from '~web/shared/forms/list-filters.form';
export { AccountReadRequest };

export class AccountFiltersForm extends ListFiltersForm<AccountFiltersFormT> {

  constructor(filters?: Partial<AccountFiltersFormT>) {
    super({
      id: undefined,
      accountType: undefined,
      email: undefined,
      fullTextQuery: undefined,
      limit: 10,
      operationHours: new OperationHoursFilterForm(undefined, 'none'),
      organizationName: undefined,
      page: 1,
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

  get isDonorAccountType(): boolean {
    return (this.get('accountType').value === AccountType.Donor);
  }

  get isReceiverAccountType(): boolean {
    return (this.get('accountType').value === AccountType.Receiver);
  }

  get isVolunteerAccountType(): boolean {
    return (this.get('accountType').value === AccountType.Volunteer);
  }

  get isOrganizationAccountType(): boolean {
    return (this.isDonorAccountType || this.isReceiverAccountType);
  }

  get page(): number {
    return this.get('page').value;
  }

  set page(page: number) {
    this.get('page').setValue(page);
  }

  /**
   * Converts the contained form value to a valid AccountReadRequest.
   * @return The converted AccountReadRequest.
   */
  toReadRequest(): AccountReadRequest {
    const value: AccountFiltersFormT = this.value;
    if (value.operationHours) {
      value.operationHoursWeekday = value.operationHours.weekday;
      value.operationHoursStartTime = value.operationHours.startTime;
      value.operationHoursEndTime = value.operationHours.endTime;
      delete value.operationHours;
    }
    for (const prop in value) {
      if (value[prop] == null) { delete value[prop]; }
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
   * Resets the value of all of the facet filters (while keeping the value of the `fullTextQuery` field).
   * @param options The reset options.
   */
  resetFacetFilters(options?: { resetAccountType?: boolean, onlySelf?: boolean, emitEvent?: boolean }): void {
    this.reset({ fullTextQuery: this.get('fullTextQuery').value }, options);
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
        valueCopy.operationHours.weekday = valueCopy.operationHoursWeekday;
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
