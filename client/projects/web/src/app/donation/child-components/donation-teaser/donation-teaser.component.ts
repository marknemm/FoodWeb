import { Component, Input, OnInit } from '@angular/core';
import { Donation } from '~shared';

@Component({
  selector: 'food-web-donation-teaser',
  templateUrl: './donation-teaser.component.html',
  styleUrls: ['./donation-teaser.component.scss'],
})
export class DonationTeaserComponent implements OnInit {

  @Input() donation: Donation;

  constructor() {}

  ngOnInit() {}

}
