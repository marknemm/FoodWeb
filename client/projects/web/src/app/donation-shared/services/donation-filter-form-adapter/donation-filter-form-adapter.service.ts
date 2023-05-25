import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DonationReadRequest } from '~shared';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class DonationFilterFormAdapter extends FormAdapter<DonationReadRequest, DonationFilterFormData> {

  toForm(config?: FormConfig<DonationReadRequest>): DonationFilterForm {
    config ??= {};
    config.initValue ??= { limit: 10, page: 1 };
    return this._initForm(config);
  }

  toModel(viewModel?: DonationFilterForm | Partial<DonationFilterFormData>): DonationReadRequest {
    return this._getViewModelData(viewModel);
  }

  toViewModel(model?: Partial<DonationReadRequest>): DonationFilterFormData {
    return {
      id: model?.id,
      delivererAccountId: model?.delivererAccountId,
      deliveryWindowOverlapEnd: model?.deliveryWindowOverlapEnd,
      deliveryWindowOverlapStart: model?.deliveryWindowOverlapStart,
      donationStatus: model?.donationStatus,
      donorAccountId: model?.donorAccountId,
      donorLastName: model?.donorLastName,
      donorFirstName: model?.donorFirstName,
      donorOrganizationName: model?.donorOrganizationName,
      expired: model?.expired,
      fullTextQuery: model?.fullTextQuery,
      limit: model?.limit,
      myDonations: model?.myDonations,
      page: model?.limit,
      receiverAccountId: model?.receiverAccountId,
      receiverOrganizationName: model?.receiverOrganizationName,
      sortBy: model?.sortBy,
      sortOrder: model?.sortOrder
    };
  }

}

export type DonationFilterForm = FormGroup<Controls<DonationFilterFormData>>;
export type DonationFilterFormData = Required<Omit<DonationReadRequest, 'maxId' | 'latestTimestamp'>>;
