import { Validators } from '@angular/forms';
import { Account, Donation } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';
import { DateTimeService } from '~web/date-time/date-time/date-time.service';
import { DonateForm, DonationFormT } from '~web/donor/forms/donate.form';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class CreateDonationForm extends TypedFormGroup<CreateDonationFormT> {

  constructor(
    dateTimeService: DateTimeService,
    destroy$: Observable<any>,
    donorAccount?: Account
  ) {
    super({
      donateForm: new DonateForm(dateTimeService, { donorAccount, safetyChecklistInit: true }),
      donorAccount: [donorAccount, Validators.required],
      sendNotifications: true
    });
    this._listenForDonorAccountChange(destroy$);
  }

  get donateForm(): DonateForm {
    return <DonateForm> this.get('donateForm');
  }

  get donorAccount(): Account {
    return this.get('donorAccount').value;
  }

  get sendNotifications(): boolean {
    return this.get('sendNotifications').value;
  }

  private _listenForDonorAccountChange(destroy$: Observable<any>): void {
    this.get('donorAccount').valueChanges.pipe(
      takeUntil(destroy$)
    ).subscribe((donorAccount: Account) =>
      this.donateForm.deriveValuesFromDonorAccount(donorAccount)
    );
  }

  toDonation(): Donation {
    const donation: Donation = this.donateForm.toDonation();
    donation.donorAccount = this.donorAccount;
    return donation;
  }
}

export interface CreateDonationFormT {
  donateForm: DonationFormT;
  donorAccount: Account;
  sendNotifications: boolean;
}
