import { Component, OnInit, ViewChild } from '@angular/core';
import { Donation } from '~shared';
import { DateTimeRangeComponent } from '~web/date-time/date-time-range/date-time-range.component';
import { DateTimeService } from '~web/date-time/date-time/date-time.service';
import { DonationService } from '~web/donation/donation/donation.service';
import { DonateForm } from '~web/donor/donate.form';
import { SessionService } from '~web/session/session/session.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-create-donation',
  templateUrl: './create-donation.component.html',
  styleUrls: ['./create-donation.component.scss'],
})
export class CreateDonationComponent implements OnInit {

  /**
   * Reactive form model used for donation.
   */
  formGroup: DonateForm;
  /**
   * The newly saved donation that is only set once the donation is complete.
   * Will be unset if the user chooses to donate again.
   */
  savedDonation: Donation = null;

  @ViewChild('pickupWindowRange') pickupWindowRange: DateTimeRangeComponent;

  constructor(
    public pageTitleService: PageTitleService,
    public sessionService: SessionService,
    private _donationService: DonationService,
    private _dateTimeService: DateTimeService,
  ) {}

  ngOnInit() {
    this.pageTitleService.title = 'Create Donation';
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
    this.pickupWindowRange.markAsTouched();
    if (this.formGroup.valid) {
      const donation: Donation = this.formGroup.toDonation();
      this._donationService.createDonation(donation).subscribe((savedDonation: Donation) => {
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
