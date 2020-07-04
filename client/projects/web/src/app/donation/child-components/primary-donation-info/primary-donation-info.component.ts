import { Component, Input, OnInit } from '@angular/core';
import { Donation } from '~shared';

@Component({
  selector: 'food-web-primary-donation-info',
  templateUrl: './primary-donation-info.component.html',
  styleUrls: ['./primary-donation-info.component.scss'],
})
export class PrimaryDonationInfoComponent implements OnInit {

  @Input() donation: Donation;
  @Input() myDonation = false;

  constructor() {}

  ngOnInit() {}

}
