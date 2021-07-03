import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminDeliveryForm, AdminDeliveryFormT } from '~admin/admin-delivery/forms/admin-delivery.form';
import { AccountAutocompleteItem, Donation, DonationSaveData } from '~shared';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { DonateForm, DonationFormT } from '~web/donor/forms/donate.form';
import { TFormGroup } from '~web/forms';

export class AdminDonationForm extends TFormGroup<AdminDonationFormT> {

  constructor(
    dateTimeService: DateTimeService,
    destroy$: Observable<unknown>,
    donation?: Donation
  ) {
    super({
      donateForm: new DonateForm(dateTimeService, { donorAccount: donation?.donorAccount, safetyChecklistInit: true }),
      donorAccount: [<AccountAutocompleteItem>donation?.donorAccount, Validators.required],
      receiverAccount: <AccountAutocompleteItem>donation?.claim?.receiverAccount,
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

  get donorAccount(): AccountAutocompleteItem {
    return this.value.donorAccount;
  }

  get receiverAccount(): AccountAutocompleteItem {
    return this.get('receiverAccount').enabled ? this.value.receiverAccount : null;
  }

  get delivery(): AdminDeliveryFormT {
    return this.deliveryEnabled ? this.value.delivery : null;
  }

  get deliveryEnabled(): boolean {
    return this.get('delivery').enabled;
  }

  get volunteerAccount(): AccountAutocompleteItem {
    return this.deliveryForm.volunteerAccount;
  }

  get sendNotifications(): boolean {
    return this.value.sendNotifications;
  }

  getDonationSaveData(): DonationSaveData {
    return this.donateForm.toDonationSaveData();
  }

  private _listenForDonorAccountChange(destroy$: Observable<unknown>): void {
    this.get('donorAccount').valueChanges.pipe(
      takeUntil(destroy$)
    ).subscribe(
      () => this.donateForm.deriveValuesFromDonorAccount(this.donorAccount)
    );
    this.donateForm.deriveValuesFromDonorAccount(this.donorAccount);
  }

  private _listenForReceiverAccountChange(destroy$: Observable<unknown>): void {
    this.get('receiverAccount').valueChanges.pipe(
      takeUntil(destroy$)
    ).subscribe(
      () => this._onReceiverAccountChange(this.receiverAccount)
    );
    this._onReceiverAccountChange(this.receiverAccount);
  }

  private _onReceiverAccountChange(receiverAccount: AccountAutocompleteItem): void {
    (receiverAccount) ? this.get('delivery').enable() : this.get('delivery').disable();
  }

  /**
   * Patches this form's value based off of a given donation.
   * @param donation The donation used for the patch.
   */
  patchFromDonation(donation: Donation): void {
    this.donateForm.patchFromDonation(donation);
    this.get('donorAccount').setValue(donation.donorAccount);
    this.get('receiverAccount').setValue(donation.claim?.receiverAccount);
    this.deliveryForm.patchFromDelivery(donation.claim?.delivery);
  }

  /**
   * Resets the value of the donation form and marks all fields as untouched/pristine.
   * Sets all direct child form fields to null except for 'donorAccount', 'receiverAccount', & 'sendNotifications'.
   * @override
   */
  reset(): void {
    const donorAccount: AccountAutocompleteItem = this.donorAccount;
    const receiverAccount: AccountAutocompleteItem = this.receiverAccount;
    const sendNotifications: boolean = this.sendNotifications;
    super.reset({ donorAccount, receiverAccount, sendNotifications });
  }
}

export interface AdminDonationFormT {
  donateForm: DonationFormT;
  donorAccount: AccountAutocompleteItem;
  receiverAccount: AccountAutocompleteItem;
  delivery: AdminDeliveryFormT;
  sendNotifications: boolean;
}
