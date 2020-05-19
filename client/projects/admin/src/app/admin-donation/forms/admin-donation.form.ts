import { Validators } from '@angular/forms';
import { Account, Delivery, Donation } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';
import { DateTimeService } from '~web/date-time/date-time/date-time.service';
import { DonateForm, DonationFormT } from '~web/donor/forms/donate.form';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminDeliveryForm, AdminDeliveryFormT } from './admin-delivery.form';

export class AdminDonationForm extends TypedFormGroup<AdminDonationFormT> {

  constructor(
    dateTimeService: DateTimeService,
    destroy$: Observable<any>,
    donation?: Donation
  ) {
    super({
      donateForm: new DonateForm(dateTimeService, { donorAccount: donation?.donorAccount, safetyChecklistInit: true }),
      donorAccount: [donation?.donorAccount, Validators.required],
      receiverAccount: donation?.claim?.receiverAccount,
      delivery: new AdminDeliveryForm(donation?.claim?.delivery),
      sendNotifications: true,
    });
    this._listenForDonorAccountChange(destroy$);
    this._listenForReceiverAccountChange(destroy$);
  }

  get donateForm(): DonateForm {
    return <DonateForm> this.get('donateForm');
  }

  get donorAccount(): Account {
    return this.get('donorAccount').value;
  }

  get receiverAccount(): Account {
    return this.get('receiverAccount').value;
  }

  get delivery(): Partial<Delivery> {
    return this.get('delivery').value;
  }

  get volunteerAccount(): Account {
    return this.delivery?.volunteerAccount;
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

  private _listenForReceiverAccountChange(destroy$: Observable<any>): void {
    this.get('receiverAccount').valueChanges.pipe(
      takeUntil(destroy$)
    ).subscribe((receiverAccount: Account) =>
      (receiverAccount) ? this.get('delivery').enable() : this.get('delivery').disable()
    );
  }

  toDonation(): Donation {
    const donation: Donation = this.donateForm.toDonation();
    donation.donorAccount = this.donorAccount;
    return donation;
  }
}

export interface AdminDonationFormT {
  donateForm: DonationFormT;
  donorAccount: Account;
  receiverAccount: Account;
  delivery: AdminDeliveryFormT;
  sendNotifications: boolean;
}
