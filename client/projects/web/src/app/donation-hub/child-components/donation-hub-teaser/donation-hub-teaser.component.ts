import { Component, Input, OnInit } from '@angular/core';
import { DonationHub } from '~shared';

/**
 * A teaser for a donation hub.
 */
@Component({
  selector: 'foodweb-donation-hub-teaser',
  templateUrl: './donation-hub-teaser.component.html',
  styleUrls: ['./donation-hub-teaser.component.scss']
})
export class DonationHubTeaserComponent implements OnInit {

  @Input() donationHub: DonationHub;

  constructor() {}

  ngOnInit() {}
}
