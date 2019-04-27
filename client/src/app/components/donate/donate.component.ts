import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DonationService, Donation } from '../../services/donation/donation.service';

@Component({
  selector: 'food-web-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {

  /**
   * The donation form. Will be initialized and filled by the Donation child component.
   */
  readonly donateForm: FormGroup = new FormGroup({});

  /**
   * The newly saved donation that is only set once the donation is complete.
   * Will be unset if the user chooses to donate again.
   */
  savedDonation: Donation = null;

  constructor(
    private _donationService: DonationService
  ) {}

  ngOnInit() {}

  /**
   * Submits the donation to be created on the server.
   */
  donate(): void {
    if (this.donateForm.valid) {
      const donation: Donation = this.donateForm.getRawValue();
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
