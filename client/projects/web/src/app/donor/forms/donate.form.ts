import { Validators } from '@angular/forms';
import { Account, ContactInfo, DateTimeRange, Donation, Validation } from '~shared';
import { ContactInfoForm } from '~web/account/contact-info.form';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';
import { DateTimeRangeForm } from '~web/date-time/date-time-range.form';
import { DateTimeService } from '~web/date-time/date-time/date-time.service';

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
    this.get('safetyChecklist').patchValue(config.safetyChecklistInit);
    this.deriveValuesFromDonorAccount(config.donorAccount);
  }

  deriveValuesFromDonorAccount(donorAccount: Account): void {
    if (donorAccount) {
      this.get('donorContactOverride').patchValue(
        this._genContactOverrideFromAccount(donorAccount)
      );
    }
  }

  private _genContactOverrideFromAccount(donorAccount: Account): ContactInfo {
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
   * @override
   */
  reset(): void {
    const donorFirstName: string = this.get('donorFirstName').value;
    const donorLastName: string = this.get('donorLastName').value;
    const pickupWindow: DateTimeRange = this.get('pickupWindow').value;
    const donorContactOverride: ContactInfo = this.get('donorContactOverride').value;
    super.reset({
      donationType: 'Food',
      donorFirstName,
      donorLastName,
      pickupWindow,
      donorContactOverride,
      safetyChecklist: true
    });
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
  estimatedNumFeed: number;
  estimatedValue?: number;
  description: string;
  pickupWindow: DateTimeRange;
  donorContactOverride: ContactInfo;
  safetyChecklist: boolean;
}
