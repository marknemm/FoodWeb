import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateTimeRange, DateTimeService } from '../date-time/date-time.service';
import { Account } from '../../../../../shared/src/interfaces/account/account';
import { Validation } from '../../../../../shared/src/constants/validation';
import { Donation } from '../../../../../shared/src/interfaces/donation/donation';

interface DonationFormValue {
  donorFirstName: string;
  donorLastName: string;
  donationType: string;
  otherDonationType?: string;
  pickupWindow: DateTimeRange;
  estimatedNumFeed: number;
  estimatedValue?: number;
  description: string;
}

@Injectable()
export class DonationFormService {

  donationForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _dateTimeService: DateTimeService
  ) {}

  buildCreateDonationForm(donorAccount: Account): FormGroup {
    return this._buildDonationForm(donorAccount, false);
  }

  buildUpdateDonationForm(): FormGroup {
    return this._buildDonationForm();
  }

  private _buildDonationForm(donorAccount?: Account, safetyChecklistInit = true): FormGroup {
    const initPickupWindow: DateTimeRange = (donorAccount)
      ? this._dateTimeService.genDefaultDateRangeFromAvailability(donorAccount)
      : null;
    this.donationForm = this._formBuilder.group({
      donorFirstName: ['', Validators.required],
      donorLastName: ['', Validators.required],
      donationType: ['Food', Validators.required],
      otherDonationType: [null, Validators.required],
      pickupWindow: [initPickupWindow, Validators.required],
      estimatedNumFeed: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d*$/)]],
      estimatedValue: [null, [Validators.min(0), Validators.pattern(Validation.MONEY_REGEX)]],
      description: ['', Validators.required],
      safetyChecklist: [safetyChecklistInit, Validators.requiredTrue]
    });
    this.donationForm.get('otherDonationType').disable();
    return this.donationForm;
  }

  updateFormValue(donation: Donation): void {
    this.donationForm.patchValue(donation);
    this.donationForm.get('pickupWindow').setValue({
      startDateTime: donation.pickupWindowStart,
      endDateTime: donation.pickupWindowEnd
    });
  }

  resetDonationForm(): void {
    const donationWindow: DateTimeRange = this.donationForm.get('pickupWindow').value;
    const donorFirstName: string = this.donationForm.get('donorFirstName').value;
    const donorLastName: string = this.donationForm.get('donorLastName').value;
    this.donationForm.reset();
    this.donationForm.get('donationType').setValue('Food');
    this.donationForm.get('pickupWindow').setValue(donationWindow);
    this.donationForm.get('donorFirstName').setValue(donorFirstName);
    this.donationForm.get('donorLastName').setValue(donorLastName);
    this.donationForm.get('safetyChecklist').setValue(true);
  }

  getDonationFromForm(): Donation {
    const formValue: DonationFormValue = this.donationForm.getRawValue();
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

  listenForDonationTypeUpdate(destroy$: Observable<any>): void {
    this.donationForm.get('donationType').valueChanges.pipe(
      takeUntil(destroy$)
    ).subscribe(
      this._updateOtherDonationTypeState.bind(this)
    );
  }

  private _updateOtherDonationTypeState(donationType: string): void {
    const otherDonationTypeCtrl = <FormControl>this.donationForm.get('otherDonationType');
    (donationType === 'Other')
      ? otherDonationTypeCtrl.enable({ emitEvent: false })
      : otherDonationTypeCtrl.disable({ emitEvent: false });
  }
}
