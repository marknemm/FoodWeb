import { Validators } from '@angular/forms';
import { Account, ContactInfo, DonationHub, TimeRange } from '~shared';
import { ContactInfoForm } from '~web/account-shared/forms/contact-info.form';
import { TimeRangeForm } from '~web/date-time/forms/time-range.form';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { TFormGroup } from '~web/forms';

export class DonationHubForm extends TFormGroup<DonationHubFormT> {

  constructor(
    private _dateTimeService: DateTimeService,
    config: DonationHubFormConfig = {}
  ) {
    super({
      id: [undefined],
      agreementChecklist: [false, config.omitChecklists ? [] : [Validators.requiredTrue]],
      contactOverride: new ContactInfoForm(),
      dropOffDate: [undefined, Validators.required],
      dropOffInstructions: ['', Validators.required],
      dropOffTimeRange: new TimeRangeForm({ startTime: '1:30 PM', endTime: '2:30 PM' }, 'all')
    });
    this._deriveValuesFromAccount(config.account);
    if (config.value) {
      this.patchValue(config.value);
    }
  }

  private _deriveValuesFromAccount(account: Account): void {
    if (account) {
      const contactOverride: ContactInfo = Object.assign({}, account.contactInfo);
      delete contactOverride.id;
      this.get('contactOverride').patchValue(contactOverride);
    }
  }

  fromDonationHub(donationHub: Partial<DonationHubFormT | DonationHub>): DonationHubFormT {
    if (!(<DonationHub>donationHub).dropOffWindowStart) {
      return <DonationHubFormT>donationHub;
    }

    // Map over all direct 1-1 properties from the given donation hub to the raw form value.
    const donationHubFormVal: DonationHubFormT = this.getRawValue();
    for (const propKey in donationHub) {
      if (donationHub.hasOwnProperty(propKey) && ['dropOffWindowStart', 'dropOffWindowEnd'].indexOf(propKey) < 0) {
        donationHubFormVal[propKey] = donationHub[propKey];
      }
    }
    // Map over the individual 'dropOffWindow*' properties in the DonationHub model to the single 'dropOffTimeRange' value in the form.
    donationHubFormVal.dropOffDate = (<DonationHub>donationHub).dropOffWindowStart;
    donationHubFormVal.dropOffTimeRange = {
      startTime: this._dateTimeService.toTimeStr((<DonationHub>donationHub).dropOffWindowStart),
      endTime: this._dateTimeService.toTimeStr((<DonationHub>donationHub).dropOffWindowEnd)
    };

    return donationHubFormVal;
  }

  toDonationHub(value: DonationHubFormT = this.value): DonationHub {
    // Map over all properties that have a direct 1-1 mapping.
    const donationHub: Partial<DonationHub> = {};
    for (const propKey in value) {
      if (value.hasOwnProperty(propKey) && propKey !== 'dropOffTimeRange') {
        donationHub[propKey] = value[propKey];
      }
    }

    // Christmas Eve Special.
    if (value.dropOffDate.getMonth() === 11 && value.dropOffDate?.getDate() === 24 && value.dropOffDate?.getFullYear() === 2021) {
      value.dropOffTimeRange = { startTime: '10:30 AM', endTime: '11:30 AM' };
    }

    // Map over the 'dropOffTimeRange' FormGroup to the individual 'dropOffWindow*' properties in the DonationHub model.
    donationHub.dropOffWindowStart = this._dateTimeService.combineDateTime(value.dropOffDate, value.dropOffTimeRange.startTime);
    donationHub.dropOffWindowEnd = this._dateTimeService.combineDateTime(value.dropOffDate, value.dropOffTimeRange.endTime);
    return <DonationHub>donationHub;
  }
}

export interface DonationHubFormConfig {
  account?: Account;
  omitChecklists?: boolean;
  value?: DonationHubFormT | DonationHub;
}

export interface DonationHubFormT {
  id?: number;
  agreementChecklist?: boolean;
  contactOverride: ContactInfo;
  dropOffDate: Date;
  dropOffInstructions: string;
  dropOffTimeRange: TimeRange;
  readyChecklist?: boolean;
}
