import { Injectable, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccountReadRequest, AccountSortBy, AccountType, OperationHours } from '~shared';
import { OperationHoursFilterFormAdapter } from '~web/account-shared/services/operation-hours-filter-form-adapter/operation-hours-filter-form-adapter.service';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class AccountFilterFormAdapter extends FormAdapter<AccountReadRequest, AccountFilterFormData> {

  constructor(
    injector: Injector,
    private _operationHoursFilterFormAdapter: OperationHoursFilterFormAdapter
  ) {
    super(injector);
  }

  toForm(config?: FormConfig<AccountReadRequest>): AccountFilterForm {
    const form: AccountFilterForm = this._formBuilder.group({
      accountType: undefined as AccountType,
      email: undefined as string,
      fullTextQuery: undefined as string,
      limit: 10,
      operationHours: this._operationHoursFilterFormAdapter.toForm({ validationMode: 'none' }),
      organizationName: undefined as string,
      page: 1,
      signedAgreement: undefined as boolean,
      sortBy: undefined as AccountSortBy,
      sortOrder: undefined as 'ASC' | 'DESC',
      username: undefined as string,
      verified: undefined as boolean,
      volunteerFirstName: undefined as string,
      volunteerLastName: undefined as string
    }, config);

    return this._initForm(form, config);
  }

  toModel(viewModel?: AccountFilterForm | Partial<AccountFilterFormData>): AccountReadRequest {
    const viewModelData: AccountFilterFormData = this._getViewModelData(viewModel);
    return {
      accountType: viewModelData?.accountType,
      email: viewModelData?.email,
      fullTextQuery: viewModelData?.fullTextQuery,
      limit: (viewModelData?.limit ?? 10),
      operationHoursWeekday: viewModelData?.operationHours?.weekday,
      operationHoursStartTime: viewModelData?.operationHours?.startTime,
      operationHoursEndTime: viewModelData?.operationHours?.endTime,
      organizationName: viewModelData?.organizationName,
      page: (viewModelData?.page ?? 1),
      signedAgreement: viewModelData?.signedAgreement,
      sortBy: viewModelData?.sortBy,
      sortOrder: viewModelData?.sortOrder,
      username: viewModelData?.username,
      verified: viewModelData?.verified,
      volunteerFirstName: viewModelData?.volunteerFirstName,
      volunteerLastName: viewModelData?.volunteerLastName
    };
  }

  toViewModel(model?: Partial<AccountReadRequest>): AccountFilterFormData {
    return {
      accountType: model?.accountType,
      email: model?.email,
      fullTextQuery: model?.fullTextQuery,
      limit: model?.limit,
      operationHours: {
        weekday: model?.operationHoursWeekday,
        startTime: model?.operationHoursStartTime,
        endTime: model?.operationHoursEndTime
      },
      organizationName: model?.organizationName,
      page: model?.page,
      signedAgreement: model?.signedAgreement
        ? model.signedAgreement && model.signedAgreement !== 'false'
        : undefined,
      sortBy: model?.sortBy,
      sortOrder: model?.sortOrder,
      username: model?.username,
      verified: model.verified
        ? model.verified && model.verified !== 'false'
        : undefined,
      volunteerFirstName: model?.volunteerFirstName,
      volunteerLastName: model?.volunteerLastName
    };
  }

}

export type AccountFilterForm = FormGroup<Controls<AccountFilterFormData>>;
export interface AccountFilterFormData {
  accountType: AccountType,
  email: string,
  fullTextQuery: string,
  limit: number,
  operationHours: Partial<OperationHours>,
  organizationName: string,
  page: number,
  signedAgreement: boolean,
  sortBy: AccountSortBy,
  sortOrder: 'ASC' | 'DESC',
  username: string,
  verified: boolean,
  volunteerFirstName: string,
  volunteerLastName: string
}
