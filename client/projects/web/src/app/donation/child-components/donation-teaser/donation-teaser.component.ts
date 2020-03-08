import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { Donation, DonationHelper } from '~shared';

@Component({
  selector: 'food-web-donation-teaser',
  templateUrl: './donation-teaser.component.html',
  styleUrls: ['./donation-teaser.component.scss'],
})
export class DonationTeaserComponent implements OnInit, OnChanges {

  @Input() donation: Donation;

  private _donationRouterLink: string[] = [];
  private _donorName = '';

  constructor(
    private _donationHelper: DonationHelper
  ) {}

  ngOnInit() {}

  get donationRouterLink(): string[] {
    return this._donationRouterLink;
  }

  get donorName(): string {
    return this._donorName;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.donation) {
      this._donorName = this._donationHelper.donorName(this.donation);
      this._donationRouterLink = this._donationHelper.donationDetailsRouterLink(this.donation);
    }
  }

}
