import { Component, OnInit, ViewChild } from '@angular/core';
import { DonateForm } from '../../forms/donate.form';
import { SessionService } from '../../../session/services/session/session.service';
import { DonationService, Donation } from '../../../donation/services/donation/donation.service';
import { DateTimeRangeComponent } from '../../../date-time/child-components/date-time-range/date-time-range.component';
import { DateTimeService } from '../../../date-time/services/date-time/date-time.service';

@Component({
  selector: 'food-web-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {

  /**
   * Reactive form model used for donation.
   */
  donateForm: DonateForm;
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
    this.donateForm = new DonateForm(
      this._dateTimeService,
      { donorAccount: this.sessionService.account, safetyChecklistInit: false }
    );
  }

  /**
   * Submits the donation to be created on the server.
   */
  donate(): void {
    this.donateForm.markAllAsTouched();
    this.pickupWindowRange.markAsTouched();
    if (this.donateForm.valid) {
      const donation: Donation = this.donateForm.toDonation();
      this._donationService.createDonation(donation).subscribe((savedDonation: Donation) => {
        this.savedDonation = savedDonation;
      });
    }
  }

  /**
   * Resets the donation form to create another donation.
   */
  donateAgain(): void {
    this.donateForm.reset();
    this.savedDonation = null;
  }

}
