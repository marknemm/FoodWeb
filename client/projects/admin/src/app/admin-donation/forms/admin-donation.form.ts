import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminDeliveryForm, AdminDeliveryFormT } from '~admin/admin-donation/forms/admin-delivery.form';
import { Account, Delivery, Donation } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';
import { DateTimeService } from '~web/date-time/date-time/date-time.service';
import { DonateForm, DonationFormT } from '~web/donor/forms/donate.form';

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
      delivery: new AdminDeliveryForm(destroy$, donation?.claim?.delivery),
      sendNotifications: true,
    });
    this._listenForDonorAccountChange(destroy$);
    this._listenForReceiverAccountChange(destroy$);
  }

  get donateForm(): DonateForm {
    return <DonateForm> this.get('donateForm');
  }

  get deliveryForm(): AdminDeliveryForm {
    return <AdminDeliveryForm> this.get('delivery');
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

  get deliveryEnabled(): boolean {
    return this.get('delivery').enabled;
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
    ).subscribe(
      () => this.donateForm.deriveValuesFromDonorAccount(this.donorAccount)
    );
    this.donateForm.deriveValuesFromDonorAccount(this.donorAccount);
  }

  private _listenForReceiverAccountChange(destroy$: Observable<any>): void {
    this.get('receiverAccount').valueChanges.pipe(
      takeUntil(destroy$)
    ).subscribe(
      () => this._onReceiverAccountChange(this.receiverAccount)
    );
    this._onReceiverAccountChange(this.receiverAccount);
  }

  private _onReceiverAccountChange(receiverAccount: Account): void {
    (receiverAccount) ? this.get('delivery').enable() : this.get('delivery').disable();
  }

  toDonation(): Donation {
    const donation: Donation = this.donateForm.toDonation();
    donation.donorAccount = this.donorAccount;
    return donation;
  }

  /**
   * Resets the value of the donation form and marks all fields as untouched/pristine.
   * Sets all direct child form fields to null except for 'donorAccount', 'receiverAccount', & 'sendNotifications'.
   * @override
   */
  reset(): void {
    const donorAccount: Account = this.donorAccount;
    const receiverAccount: Account = this.receiverAccount;
    const sendNotifications: boolean = this.sendNotifications;
    super.reset({ donorAccount, receiverAccount, sendNotifications });
  }
}

export interface AdminDonationFormT {
  donateForm: DonationFormT;
  donorAccount: Account;
  receiverAccount: Account;
  delivery: AdminDeliveryFormT;
  sendNotifications: boolean;
}
