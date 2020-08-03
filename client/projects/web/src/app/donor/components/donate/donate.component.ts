import { Component, OnInit, ViewChild } from '@angular/core';
import { Donation, DonationSaveData } from '~shared';
import { DateTimeRangeComponent } from '~web/date-time/child-components/date-time-range/date-time-range.component';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { DonationSaveService } from '~web/donation/services/donation-save/donation-save.service';
import { DonateForm } from '~web/donor/forms/donate.form';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-donate',
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

  @ViewChild('pickupWindowRange') pickupWindowRange: DateTimeRangeComponent;

  constructor(
    public sessionService: SessionService,
    private _donationSaveService: DonationSaveService,
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
