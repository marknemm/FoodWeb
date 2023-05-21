import { Injectable, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DonationHubPledgeReadRequest } from '~shared';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class DonationHubPledgeFilterFormAdapter extends FormAdapter<DonationHubPledgeReadRequest, DonationHubPledgeFormData> {

  constructor(
    injector: Injector,
    private _dateTimeService: DateTimeService
  ) {
    super(injector);
  }

  toForm(config?: FormConfig<DonationHubPledgeReadRequest>): DonationHubPledgeFilterForm {
    return this._formBuilder.group(this.toViewModel(config?.initValue ?? {
      limit: 10,
      page: 1
    }), config);
  }

  toModel(viewModel?: DonationHubPledgeFilterForm | DonationHubPledgeFormData): DonationHubPledgeReadRequest {
    return this._getViewModelData(viewModel);
  }

  toViewModel(model?: DonationHubPledgeReadRequest): DonationHubPledgeFormData {
    return {
      accountId: model?.accountId,
      donationHubId: model?.donationHubId,
      dropOffWindowOverlapEnd: (model?.dropOffWindowOverlapEnd)
        ? this._dateTimeService.toDate(model.dropOffWindowOverlapEnd)
        : undefined,
      dropOffWindowOverlapStart: (model?.dropOffWindowOverlapStart)
        ? this._dateTimeService.toDate(model.dropOffWindowOverlapStart)
        : undefined,
      includeExpired: model?.includeExpired,
      limit: model?.limit,
      loadDonationHub: model?.loadDonationHub,
      page: model?.page
    };
  }

}

export type DonationHubPledgeFilterForm = FormGroup<Controls<DonationHubPledgeFormData>>;
export interface DonationHubPledgeFormData {
  accountId: number;
  donationHubId: number;
  dropOffWindowOverlapEnd: Date;
  dropOffWindowOverlapStart: Date;
  includeExpired: boolean;
  limit: number;
  loadDonationHub: boolean;
  page: number;
}
