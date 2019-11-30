import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DonationStatus } from '~shared';

@Component({
  selector: 'food-web-donation-status',
  templateUrl: './donation-status.component.html',
  styleUrls: ['./donation-status.component.scss']
})
export class DonationStatusComponent implements OnInit, OnChanges {

  @Input() donationStatus: DonationStatus;

  private _donationStatusClass = '';
  private _donationStatusTooltip = '';

  constructor() {}

  /**
   * The class for styling the donation's status indicator.
   */
  get donationStatusClass(): string {
    return this._donationStatusClass;
  }

  /**
   * The tooltip used for the donation's status indicator.
   */
  get donationStatusTooltip(): string {
    return this._donationStatusTooltip;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.donationStatus) {
      this._donationStatusClass = this._genDonationStatusClass();
      this._donationStatusTooltip = this._genDonationStatusTooltip();
    }
  }

  private _genDonationStatusClass(): string {
    return (this.donationStatus != null)
      ? this.donationStatus.toLowerCase().replace(/ /g, '-')
      : '';
  }

  private _genDonationStatusTooltip(): string {
    switch (this.donationStatus) {
      case 'Unmatched':
        return 'The donation has not been matched with a receiver';
      case 'Matched':
        return 'The donation has been matched with a receiver';
      case 'Scheduled':
        return 'The donation has been scheduled for delivery';
      case 'Picked Up':
        return 'The donation has been picked up from the donor and is on route to the receiver';
      case 'Complete':
        return 'The donation has been delivered and is complete';
    }
    return '';
  }

}
