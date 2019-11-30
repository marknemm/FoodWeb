import { Component, OnInit, ViewChild } from '@angular/core';
import { DateTimeRangeComponent } from '~web/date-time/date-time-range/date-time-range.component';
import { DateTimeService } from '~web/date-time/date-time/date-time.service';
import { Donation, DonationService } from '~web/donation/donation/donation.service';
import { DonateForm } from '~web/donor/donate.form';
import { SessionService } from '~web/session/session/session.service';

@Component({
  selector: 'food-web-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {

  /**
   * Reactive form model used for donation.
   */
  formGroup: DonateForm;
  /**
   * The newly saved donation that is only set once the donation is complete.
   * Will be unset if the user chooses to donate again.
   */
  savedDonation: Donation = null;

  @ViewChild('pickupWindowRange', { static: false }) pickupWindowRange: DateTimeRangeComponent;

  constructor(
    public sessionService: SessionService,
    private _donationService: DonationService,
    private _dateTimeService: DateTimeService
  ) {}

  ngOnInit() {
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
