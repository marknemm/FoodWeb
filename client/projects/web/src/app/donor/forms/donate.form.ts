import { Validators } from '@angular/forms';
import { Account, ContactInfo, DateTimeRange, Donation, Validation } from '~shared';
import { ContactInfoForm } from '~web/account/contact-info.form';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';
import { DateTimeRangeForm } from '~web/date-time/date-time-range.form';
import { DateTimeService } from '~web/date-time/date-time/date-time.service';
import { AccountAutocompleteItem } from '../../../../../../../shared/src/web';

export class DonateForm extends TypedFormGroup<DonationFormT> {

  constructor(
    dateTimeService: DateTimeService,
    config: DonateFormConfig = {}
  ) {
    const startDateTime: Date = dateTimeService.dateCeil5Mins(new Date());
    const endDateTime: Date = dateTimeService.addHours(startDateTime, 1);
    super({
      donorFirstName: ['', Validators.required],
      donorLastName: ['', Validators.required],
      donationType: ['Food', Validators.required],
      estimatedNumFeed: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d*$/)]],
      estimatedValue: [null, [Validators.min(0), Validators.pattern(Validation.MONEY_REGEX)]],
      description: ['', Validators.required],
      pickupWindow: new DateTimeRangeForm({
        startDateTime: [startDateTime, Validators.required],
        endDateTime: [endDateTime, Validators.required]
      }),
      donorContactOverride: new ContactInfoForm(),
      safetyChecklist: [config.safetyChecklistInit, Validators.requiredTrue]
    });
    this.get('safetyChecklist').patchValue(config.safetyChecklistInit);
    this.deriveValuesFromDonorAccount(config.donorAccount);
  }

  get pickupWindow(): DateTimeRange {
    return this.get('pickupWindow').value;
  }

  deriveValuesFromDonorAccount(donorAccount: Account | AccountAutocompleteItem): void {
    if (donorAccount) {
      const donorContactOverride: ContactInfo = Object.assign({}, donorAccount.contactInfo);
      delete donorContactOverride.id;
      this.get('donorContactOverride').patchValue(donorContactOverride);
    }
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
