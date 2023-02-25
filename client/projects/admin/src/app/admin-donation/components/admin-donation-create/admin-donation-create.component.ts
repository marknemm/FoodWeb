import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AdminDonationForm } from '~admin/admin-donation/forms/admin-donation.form';
import { AdminDonationSaveService } from '~admin/admin-donation/services/admin-donation-save/admin-donation-save.service';
import { Donation } from '~shared';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-admin-donation-create',
  templateUrl: './admin-donation-create.component.html',
  styleUrls: ['./admin-donation-create.component.scss'],
})
export class AdminDonationCreateComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject<void>();
  private _formGroup: AdminDonationForm;
  private _savedDonation: Donation = null;

  constructor(
    public sessionService: SessionService,
    private _dateTimeService: DateTimeService,
    private _donationSaveService: AdminDonationSaveService
  ) {}

  /**
   * The admin donation form model.
   */
  get formGroup(): AdminDonationForm {
    return this._formGroup;
  }

  /**
   * The newly saved donation that is only set once the donation is complete.
   * Will be unset if the user chooses to donate again.
   */
  get savedDonation(): Donation {
    return this._savedDonation;
  }

  ngOnInit() {
    this._formGroup = new AdminDonationForm(this._dateTimeService, this._destroy$);
  }

  ngOnDestroy() {
    this._destroy$.next(); // Cleanup any RxJS subscriptions.
  }

  /**
   * Submits the donation to be created on the server.
   */
  submitDonation(): void {
    this._donationSaveService.createDonation(this._formGroup).subscribe(
      (savedDonation: Donation) => this._savedDonation = savedDonation
    );
  }

  /**
   * Resets the donation form to create another donation.
   */
  donateAgain(): void {
    this.formGroup.reset();
    this._savedDonation = null;
  }

}
