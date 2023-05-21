import { Injectable, Injector } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Account, ContactInfo, DonationHub, TimeRange } from '~shared';
import { ContactInfoFormAdapter } from '~web/account-shared/services/contact-info-form-adapter/contact-info-form-adapter.service';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { TimeRangeFormAdapter } from '~web/date-time/services/time-range-form-adapter/time-range-form-adapter.service';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class DonationHubFormAdapter extends FormAdapter<DonationHub, DonationHubFormData> {

  constructor(
    injector: Injector,
    private _contactInfoFormAdapter: ContactInfoFormAdapter,
    private _dateTimeService: DateTimeService,
    private _timeRangeFormAdapter: TimeRangeFormAdapter,
  ) {
    super(injector);
  }

  toForm(config: DonationHubFormConfig): DonationHubForm {
    const form: DonationHubForm = this._formBuilder.group({
      id: [undefined as number],
      agreementChecklist: [false, config.omitChecklists ? [] : [Validators.requiredTrue]],
      contactOverride: this._contactInfoFormAdapter.toForm({ initValue: config?.account?.contactInfo }),
      dropOffDate: [undefined as Date, Validators.required],
      dropOffInstructions: ['', Validators.required],
      dropOffTimeRange: this._timeRangeFormAdapter.toForm({
        initValue: { startTime: '1:30 PM', endTime: '2:30 PM' },
        validationMode: 'all'
      }),
    }, config);

    if (config?.initValue) {
      this.patchFromModel(form, config.initValue);
    }

    return form;
  }

  toModel(viewModel?: DonationHubForm | Partial<DonationHubFormData>): DonationHub {
    const viewModelData: DonationHubFormData = this._getViewModelData(viewModel);
    return {
      id: viewModelData?.id,
      dropOffWindowStart: this._dateTimeService.combineDateTime(viewModelData?.dropOffDate, viewModelData?.dropOffTimeRange.startTime),
      dropOffWindowEnd: this._dateTimeService.combineDateTime(viewModelData?.dropOffDate, viewModelData?.dropOffTimeRange.endTime),
      dropOffInstructions: viewModelData?.dropOffInstructions,
      contactOverride: viewModelData?.contactOverride,
    };
  }

  toViewModel(model?: Partial<DonationHub>, account?: Partial<Account>): DonationHubFormData {
    return {
      id: model?.id,
      agreementChecklist: false,
      contactOverride: this._contactInfoFormAdapter.toViewModel(model?.contactOverride ?? account?.contactInfo),
      dropOffDate: model?.dropOffWindowStart,
      dropOffInstructions: model?.dropOffInstructions,
      dropOffTimeRange: this._timeRangeFormAdapter.toViewModel({
        startTime: (model?.dropOffWindowStart)
          ? this._dateTimeService.toTimeStr(model.dropOffWindowStart)
          : undefined,
        endTime: (model?.dropOffWindowEnd)
          ? this._dateTimeService.toTimeStr(model.dropOffWindowEnd)
          : undefined
      }),
    };
  }

}

export type DonationHubForm = FormGroup<Controls<DonationHubFormData>>;
export interface DonationHubFormData {
  id: number;
  agreementChecklist: boolean;
  contactOverride: ContactInfo;
  dropOffDate: Date;
  dropOffInstructions: string;
  dropOffTimeRange: TimeRange;
}

export interface DonationHubFormConfig extends FormConfig<DonationHub> {
  account: Account;
  omitChecklists?: boolean;
}
