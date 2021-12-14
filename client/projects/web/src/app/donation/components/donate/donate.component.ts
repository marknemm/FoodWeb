import { Component, OnInit } from '@angular/core';
import { Donation, DonationSaveData } from '~shared';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { DonateForm } from '~web/donation/forms/donate.form';
import { DonationSaveService } from '~web/donation/services/donation-save/donation-save.service';
import { SessionService } from '~web/session/services/session/session.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {

  readonly foodSafetyChecklistMembers = [
    'Food storage area is clean',
    'Proper personal hygiene observed',
    'Food has been temperature controlled',
    'No bulging or leaking packages',
    'Mold or decay is not present',
    'Food has not expired',
  ];

  /**
   * Reactive form model used for donation.
   */
  formGroup: DonateForm;
  /**
   * The newly saved donation that is only set once the donation is complete.
   * Will be unset if the user chooses to donate again.
   */
  savedDonation: Donation = null;

  constructor(
    public sessionService: SessionService,
    protected _dateTimeService: DateTimeService,
    protected _donationSaveService: DonationSaveService,
    protected _pageTitleService: PageTitleService,
  ) {}

  ngOnInit() {
    this._pageTitleService.title = 'Donate';
    this.formGroup = new DonateForm(
      this._dateTimeService,
      { donorAccount: this.sessionService.account, safetyChecklistInit: false }
    );
  }

  /**
   * Submits the donation to be created on the server.
   */
  donate(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const donationSaveData: DonationSaveData = this.formGroup.toDonationSaveData();
      this._donationSaveService.createDonation(donationSaveData).subscribe((savedDonation: Donation) => {
        this.savedDonation = savedDonation;
      });
    }
  }

  /**
   * Resets the donation form to create another donation.
   */
  donateAgain(): void {
    this.formGroup.reset();
    this.savedDonation = null;
  }

}
