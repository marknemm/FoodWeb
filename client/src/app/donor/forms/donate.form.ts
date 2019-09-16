import { Validators } from '@angular/forms';
import { TypedFormGroup } from '../../data-structure/typed-form-group';
import { ContactInfoForm } from '../../account/forms/contact-info.form';
import { DateTimeService } from '../../date-time/services/date-time/date-time.service';
import { Account, ContactInfo } from '../../../../../shared/src/interfaces/account/account';
import { DateTimeRange } from '../../../../../shared/src/interfaces/misc/time';
import { Validation } from '../../../../../shared/src/constants/validation';
import { Donation } from '../../../../../shared/src/interfaces/donation/donation';
import { DateTimeRangeForm } from 'src/app/date-time/forms/date-time-range.form';

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

export class DonateForm extends TypedFormGroup<DonationFormT> {
  
  constructor(donorAccount?: Account, dateTimeService?: DateTimeService, safetyChecklistInit = true) {
    super({
      donorFirstName: ['', Validators.required],
      donorLastName: ['', Validators.required],
      donationType: ['Food', Validators.required],
      otherDonationType: [null, Validators.required],
      estimatedNumFeed: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d*$/)]],
      estimatedValue: [null, [Validators.min(0), Validators.pattern(Validation.MONEY_REGEX)]],
      description: ['', Validators.required],
      pickupWindow: new DateTimeRangeForm(undefined, true),
      donorContactOverride: new ContactInfoForm(),
      safetyChecklist: [safetyChecklistInit, Validators.requiredTrue]
    });
    this.get('pickupWindow').patchValue(
      this._genInitPickupWindow(donorAccount, dateTimeService)
    );
    this.get('donorContactOverride').patchValue(
      this._genInitDonorContactOverride(donorAccount)
    );
    this.get('otherDonationType').disable();
  }

  private _genInitPickupWindow(donorAccount: Account, dateTimeService: DateTimeService): DateTimeRange {
    return (donorAccount)
      ? dateTimeService.genDefaultDateRangeFromAvailability(donorAccount)
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
    this.get('pickupWindow').setValue({
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
