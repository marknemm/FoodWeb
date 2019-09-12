import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { SessionService } from '../../../session/services/session/session.service';
import { DonationService, Donation } from '../../../donation/services/donation/donation.service';
import { DonationFormService } from '../../services/donation-form/donation-form.service';
import { DateTimeRangeComponent } from '../../../date-time/child-components/date-time-range/date-time-range.component';

@Component({
  selector: 'food-web-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss'],
  providers: [DonationFormService]
})
export class DonateComponent implements OnInit {

  /**
   * The donation form.
   */
  donateForm: FormGroup;
  /**
   * The newly saved donation that is only set once the donation is complete.
   * Will be unset if the user chooses to donate again.
   */
  savedDonation: Donation = null;

  @ViewChild('pickupWindowRange', { static: false }) pickupWindowRange: DateTimeRangeComponent;

  private _destroy$ = new Subject();

  constructor(
    public sessionService: SessionService,
    private _donationService: DonationService,
    private _donationFormService: DonationFormService
  ) {}

  ngOnInit() {
    this.donateForm = this._donationFormService.buildCreateDonationForm(this.sessionService.account);
    this._donationFormService.listenForDonationTypeUpdate(this._destroy$.asObservable());
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  /**
   * Submits the donation to be created on the server.
   */
  donate(): void {
    this.donateForm.markAllAsTouched();
    this.pickupWindowRange.markAsTouched();
    if (this.donateForm.valid) {
      const donation: Donation = this._donationFormService.getDonationFromForm();
      this._donationService.createDonation(donation).subscribe((savedDonation: Donation) => {
        this.savedDonation = savedDonation;
      });
    }
  }

  /**
   * Resets the donation form to create another donation.
   */
  donateAgain(): void {
    this._donationFormService.resetDonationForm();
    this.savedDonation = null;
  }

}
