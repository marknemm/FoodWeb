import { Component, OnInit, ViewChild } from '@angular/core';
import { Donation, DonationSaveData } from '~shared';
import { DateTimeRangeComponent } from '~web/date-time/date-time-range/date-time-range.component';
import { DateTimeService } from '~web/date-time/date-time/date-time.service';
import { DonationSaveService } from '~web/donation/donation-save/donation-save.service';
import { DonateForm } from '~web/donor/donate.form';
import { SessionService } from '~web/session/session/session.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

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

  @ViewChild('pickupWindowRange') pickupWindowRange: DateTimeRangeComponent;

  constructor(
    public sessionService: SessionService,
    private _donationSaveService: DonationSaveService,
    private _dateTimeService: DateTimeService,
    private _pageTitleService: PageTitleService
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
