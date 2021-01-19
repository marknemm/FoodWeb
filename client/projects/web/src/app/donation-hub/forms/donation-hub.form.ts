import { ValidatorFn, Validators } from '@angular/forms';
import { Account, ContactInfo, DonationHub, TimeRange } from '~shared';
import { ContactInfoForm } from '~web/account-shared/forms/contact-info.form';
import { TimeRangeForm } from '~web/date-time/forms/time-range.form';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormState, TFormGroup, UpdateValueOptions } from '~web/forms';

export class DonationHubForm extends TFormGroup<DonationHubFormT> {

  constructor(
    private _dateTimeService: DateTimeService,
    config: DonationHubFormConfig = {}
  ) {
    super({
      id: [undefined],
      agreementChecklist: [false, DonationHubForm._genChecklistValidators(config)],
      contactOverride: new ContactInfoForm(),
      dropOffDate: [undefined, Validators.required],
      dropOffInstructions: ['', Validators.required],
      dropOffTimeRange: new TimeRangeForm(undefined, 'all'),
      readyChecklist: [false, DonationHubForm._genChecklistValidators(config)]
    });
    this._deriveValuesFromAccount(config.account)
    if (config.value) {
      this.patchValue(config.value);
    }
  }

  private static _genChecklistValidators(config: DonationHubFormConfig): ValidatorFn[] {
    return config.omitChecklists ? [] : [Validators.requiredTrue]
  }

  private _deriveValuesFromAccount(account: Account): void {
    if (account) {
      const contactOverride: ContactInfo = Object.assign({}, account.contactInfo);
      delete contactOverride.id;
      this.get('contactOverride').patchValue(contactOverride);
    }
  }

  patchValue(value: Partial<DonationHubFormT> | Partial<DonationHub>, options?: UpdateValueOptions): void {
    super.patchValue(this._fromDonationHub(value), options);
  }

  reset(value?: Partial<DonationHubFormT> | Partial<DonationHub>, options?: UpdateValueOptions): void {
    super.reset(this._fromDonationHub(value), options);
  }

  setValue(value: Partial<DonationHubFormT> | Partial<DonationHub>, options?: UpdateValueOptions): void {
    super.setValue(this._fromDonationHub(value), options);
  }

  private _fromDonationHub(donationHub: Partial<DonationHubFormT> | Partial<DonationHub>): DonationHubFormT {
    return ((<DonationHub>donationHub).dropOffWindowStart)
      ? {
        agreementChecklist: this.value.agreementChecklist,
        contactOverride: donationHub.contactOverride,
        dropOffDate: (<DonationHub>donationHub).dropOffWindowStart,
        dropOffInstructions: donationHub.dropOffInstructions,
        dropOffTimeRange: {
          startTime: this._dateTimeService.toTimeStr((<DonationHub>donationHub).dropOffWindowStart),
          endTime: this._dateTimeService.toTimeStr((<DonationHub>donationHub).dropOffWindowEnd)
        },
        readyChecklist: this.value.readyChecklist
      }
      : <DonationHubFormT>donationHub;
  }

  toDonationHub(): DonationHub {
    return {
      contactOverride: this.value.contactOverride,
      dropOffWindowStart: this._dateTimeService.combineDateTime(this.value.dropOffDate, this.value.dropOffTimeRange.startTime),
      dropOffWindowEnd: this._dateTimeService.combineDateTime(this.value.dropOffDate, this.value.dropOffTimeRange.endTime),
      dropOffInstructions: this.value.dropOffInstructions
    };
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
