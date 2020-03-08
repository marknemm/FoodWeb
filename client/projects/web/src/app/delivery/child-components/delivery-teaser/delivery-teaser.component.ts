import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DeliveryHelper, Donation, DonationHelper } from '~shared';

@Component({
  selector: 'food-web-delivery-teaser',
  templateUrl: './delivery-teaser.component.html',
  styleUrls: ['./delivery-teaser.component.scss'],
})
export class DeliveryTeaserComponent implements OnInit, OnChanges {

  @Input() donation: Donation;

  private _deliveryRouterLink: string[] = [];
  private _donorName = '';

  constructor(
    private _deliveryHelper: DeliveryHelper,
    private _donationHelper: DonationHelper
  ) {}

  get deliveryRouterLink(): string[] {
    return this._deliveryRouterLink;
  }

  get donorName(): string {
    return this._donorName;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.donation) {
      this._donorName = this._donationHelper.donorName(this.donation);
      this._deliveryRouterLink = this._deliveryHelper.deliveryDetailsRouterLink(this.donation);
    }
  }

}
