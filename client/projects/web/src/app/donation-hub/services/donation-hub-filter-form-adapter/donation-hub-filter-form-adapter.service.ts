import { Injectable, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DonationHubReadRequest } from '~shared';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class DonationHubFilterFormAdapter extends FormAdapter<DonationHubReadRequest, DonationHubFilterFormData> {

  constructor(
    injector: Injector,
    private _dateTimeService: DateTimeService
  ) {
    super(injector);
  }

  toForm(config?: FormConfig<DonationHubReadRequest>): DonationHubFilterForm {
    config ??= {};
    config.initValue ??= { limit: 10, page: 1 };
    return this._initForm(config);
  }

  toModel(viewModel?: DonationHubFilterForm | Partial<DonationHubFilterFormData>): DonationHubReadRequest {
    return this._getViewModelData(viewModel);
  }

  toViewModel(model?: Partial<DonationHubReadRequest>): DonationHubFilterFormData {
    return {
      dropOffWindowOverlapEnd: (model?.dropOffWindowOverlapEnd)
        ? this._dateTimeService.toDate(model.dropOffWindowOverlapEnd)
        : undefined,
      dropOffWindowOverlapStart: (model?.dropOffWindowOverlapStart)
        ? this._dateTimeService.toDate(model.dropOffWindowOverlapStart)
        : undefined,
      includeExpired: model?.includeExpired,
      limit: model?.limit,
      loadPledges: model?.loadPledges,
      page: model?.page,
      volunteerAccountId: model?.volunteerAccountId
    };
  }

}

export type DonationHubFilterForm = FormGroup<Controls<DonationHubFilterFormData>>;
export interface DonationHubFilterFormData {
  dropOffWindowOverlapEnd: Date;
  dropOffWindowOverlapStart: Date;
  includeExpired: boolean;
  limit: number;
  loadPledges: boolean;
  page: number;
  volunteerAccountId: number;
}
