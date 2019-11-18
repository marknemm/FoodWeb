import { Validators } from '@angular/forms';
import { TypedFormGroup } from '~web/typed-form-group';
import { Account, ContactInfo, Validation, DateTimeRange, Donation } from '~shared';

import { ContactInfoForm } from '~web/contact-info.form';
import { DateTimeRangeForm } from '~web/date-time-range.form';
import { DateTimeService } from '~web/date-time/date-time.service';

export class DonateForm extends TypedFormGroup<DonationFormT> {

  private _dateTimeService: DateTimeService;

  constructor(
    dateTimeService: DateTimeService,
    config: DonateFormConfig = {}
  ) {
    const defaultStartDateTime: Date = dateTimeService.dateCeil5Mins(new Date());
    const defaultEndDateTime: Date = dateTimeService.addHours(defaultStartDateTime, 1);
    super({
      donorFirstName: ['', Validators.required],
      donorLastName: ['', Validators.required],
      donationType: ['Food', Validators.required],
      otherDonationType: [null, Validators.required],
      estimatedNumFeed: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d*$/)]],
      estimatedValue: [null, [Validators.min(0), Validators.pattern(Validation.MONEY_REGEX)]],
      description: ['', Validators.required],
      pickupWindow: new DateTimeRangeForm({
        required: true,
        defaultStartDateTime,
        defaultEndDateTime
      }),
      donorContactOverride: new ContactInfoForm(),
      safetyChecklist: [config.safetyChecklistInit, Validators.requiredTrue]
    });
    this._dateTimeService = dateTimeService;
    this._initValidationAndValues(config);
  }

  private _initValidationAndValues(config: DonateFormConfig): void {
    if (config.donorAccount) {
      this.get('pickupWindow').patchValue(
        this._genInitPickupWindow(config.donorAccount)
      );
      this.get('donorContactOverride').patchValue(
        this._genInitDonorContactOverride(config.donorAccount)
      );
    }
    this.get('safetyChecklist').patchValue(config.safetyChecklistInit);
    this.get('otherDonationType').disable();
  }

  private _genInitPickupWindow(donorAccount: Account): DateTimeRange {
    return (donorAccount)
      ? this._dateTimeService.genDefaultDateRangeFromAvailability(donorAccount)
      : null;
  }

  private _genInitDonorContactOverride(donorAccount: Account): ContactInfo {
    if (donorAccount) {
      const shallowCopyContactInfo: ContactInfo = Object.assign({}, donorAccount.contactInfo);
      delete shallowCopyContactInfo.id;
      return shallowCopyContactInfo;
    }
    return null;
  }

  patchFromDonation(donation: Donation): void {
    super.patchValue(donation);
    this.get('pickupWindow').patchValue({
      startDateTime: donation.pickupWindowStart,
      endDateTime: donation.pickupWindowEnd
    });
  }

  /**
   * Resets the value of the donation form and marks all fields as untouched/pristine.
   * Sets all fields to null except for 'donorFirstName', 'donorLastName', 'pickupWindow',
   * 'donorContactOverride', and 'safetyChecklist'.
   */
  reset(): void {
    const donorFirstName: string = this.get('donorFirstName').value;
    const donorLastName: string = this.get('donorLastName').value;
    const donationWindow: DateTimeRange = this.get('pickupWindow').value;
    const donorContactOverride: ContactInfo = this.get('donorContactOverride').value;
    donorContactOverride
    super.reset();
    this.get('donationType').setValue('Food');
    this.get('donorFirstName').setValue(donorFirstName);
    this.get('donorLastName').setValue(donorLastName);
    this.get('pickupWindow').setValue(donationWindow);
    this.get('donorContactOverride').setValue(donorContactOverride);
    this.get('safetyChecklist').setValue(true);
  }

  toDonation(): Donation {
    const formValue: DonationFormT = this.getRawValue();
    const donation: Donation = <any>{};
    Object.keys(formValue).forEach((formValueKey: string) => {
      if (formValueKey !== 'pickupWindow') {
        donation[formValueKey] = formValue[formValueKey];
      } else {
        donation.pickupWindowStart = formValue.pickupWindow.startDateTime;
        donation.pickupWindowEnd = formValue.pickupWindow.endDateTime;
      }
    });
    return donation;
  }
}

export interface DonateFormConfig {
  donorAccount?: Account;
  safetyChecklistInit?: boolean;
}

export interface DonationFormT {
  donorFirstName: string;
  donorLastName: string;
  donationType: string;
  otherDonationType?: string;
  estimatedNumFeed: number;
  estimatedValue?: number;
  description: string;
  pickupWindow: DateTimeRange;
  donorContactOverride: ContactInfo;
  safetyChecklist: boolean;
}
