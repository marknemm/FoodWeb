import { Injectable, Injector } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Account, ContactInfo, DateTimeRange, Donation, DonationStatus, Validation } from '~shared';
import { ContactInfoFormAdapter } from '~web/account-shared/services/contact-info-form-adapter/contact-info-form-adapter.service';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class DonateFormAdapter extends FormAdapter<Donation, DonateFormData> {

  constructor(
    injector: Injector,
    private _contactInfoFormAdapter: ContactInfoFormAdapter,
    private _dateTimeService: DateTimeService,
  ) {
    super(injector);
  }

  toForm(config: DonateFormConfig): DonateForm {
    const startDateTime: Date = this._dateTimeService.dateCeil5Mins(new Date());
    const endDateTime: Date = this._dateTimeService.addHours(startDateTime, 1);
    const form: DonateForm = this._formBuilder.group({
      donorFirstName: ['', Validators.required],
      donorLastName: ['', Validators.required],
      donationType: ['Food', Validators.required],
      estimatedNumFeed: [null as number, [Validators.required, Validators.min(0), Validators.pattern(/^\d*$/)]],
      estimatedValue: [null as number, [Validators.min(0), Validators.pattern(Validation.MONEY_REGEX)]],
      description: ['', Validators.required],
      pickupWindow: this._formBuilder.group(({
        startDateTime: [startDateTime, Validators.required],
        endDateTime: [endDateTime, Validators.required]
      })),
      donorContactOverride: this._contactInfoFormAdapter.toForm({ initValue: config?.donorAccount?.contactInfo }),
      safetyChecklist: [config?.initSafetyChecklist ?? false, Validators.requiredTrue]
    }, config);

    if (config?.initValue) {
      this.patchFromModel(form, config.initValue);
    }

    return form;
  }

  toModel(viewModel?: DonateForm | Partial<DonateFormData>): Donation {
    const viewModelData: DonateFormData = this._getViewModelData(viewModel);
    return {
      complete: false,
      description: (viewModelData?.description ?? ''),
      donationType: (viewModelData?.donationType ?? 'Food'),
      donationStatus: DonationStatus.Unmatched,
      donorAccount: null,
      donorContactOverride: viewModelData?.donorContactOverride,
      donorFirstName: (viewModelData?.donorFirstName ?? ''),
      donorLastName: (viewModelData?.donorLastName ?? ''),
      estimatedNumFeed: viewModelData?.estimatedNumFeed,
      estimatedValue: viewModelData?.estimatedValue,
      pickupWindowStart: viewModelData?.pickupWindow.startDateTime,
      pickupWindowEnd: viewModelData?.pickupWindow.endDateTime
    }
  }

  toViewModel(model?: Partial<Donation>, donorAccount?: Account, safetyChecklist?: boolean): DonateFormData {
    return {
      description: model?.description,
      donationType: model?.donationType,
      donorContactOverride: this._contactInfoFormAdapter.toViewModel(model?.donorContactOverride ?? donorAccount?.contactInfo),
      donorFirstName: model?.donorFirstName,
      donorLastName: model?.donorLastName,
      estimatedNumFeed: model?.estimatedNumFeed,
      estimatedValue: model?.estimatedValue,
      pickupWindow: {
        startDateTime: model?.pickupWindowStart,
        endDateTime: model?.pickupWindowEnd
      },
      safetyChecklist
    };
  }

}

export type DonateForm = FormGroup<Controls<DonateFormData>>;
export interface DonateFormData {
  donorFirstName: string;
  donorLastName: string;
  donationType: string;
  estimatedNumFeed: number;
  estimatedValue?: number;
  description: string;
  pickupWindow: DateTimeRange;
  donorContactOverride: ContactInfo;
  safetyChecklist: boolean;
}

export interface DonateFormConfig extends FormConfig<Donation> {
  donorAccount: Account;
  initSafetyChecklist?: boolean;
}
