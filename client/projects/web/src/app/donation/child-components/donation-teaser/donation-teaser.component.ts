import { Component, Input, OnInit } from '@angular/core';
import { AccountType, Donation } from '~shared';

@Component({
  selector: 'food-web-donation-teaser',
  templateUrl: './donation-teaser.component.html',
  styleUrls: ['./donation-teaser.component.scss'],
})
export class DonationTeaserComponent implements OnInit {

  readonly AccountType = AccountType;

  @Input() donation: Donation;

  constructor() {}

  ngOnInit() {}

}
