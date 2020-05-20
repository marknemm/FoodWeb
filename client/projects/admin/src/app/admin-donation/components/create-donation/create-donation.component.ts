import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AdminDonationSaveService } from '~admin/admin-donation/admin-donation-save/admin-donation-save.service';
import { AdminDonationForm } from '~admin/admin-donation/forms/admin-donation.form';
import { Donation } from '~shared';
import { DateTimeService } from '~web/date-time/date-time/date-time.service';
import { SessionService } from '~web/session/session/session.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-create-donation',
  templateUrl: './create-donation.component.html',
  styleUrls: ['./create-donation.component.scss'],
})
export class CreateDonationComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();
  private _formGroup: AdminDonationForm;
  private _savedDonation: Donation = null;

  constructor(
    public pageTitleService: PageTitleService,
    public sessionService: SessionService,
    private _dateTimeService: DateTimeService,
    private _donationSaveService: AdminDonationSaveService
  ) {}

  /**
   * Reactive form model used for donation.
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
    this.pageTitleService.title = 'Create Donation';
    this._formGroup = new AdminDonationForm(this._dateTimeService, this._destroy$);
  }

  ngOnDestroy() {
    this._destroy$.next(); // Cleanup any RxJS subscriptions.
  }

  /**
   * Submits the donation to be created on the server.
   */
  donate(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const donation: Donation = this.formGroup.toDonation();
      const sendNotifications: boolean = this.formGroup.sendNotifications;
      this._donationSaveService.createDonation(donation, sendNotifications).subscribe((savedDonation: Donation) => {
        this._savedDonation = savedDonation;
      });
    }
  }

  /**
   * Resets the donation form to create another donation.
   */
  donateAgain(): void {
    this.formGroup.reset();
    this._savedDonation = null;
  }

}
