import { Component, Input, OnInit } from '@angular/core';
import { Donation } from '~shared';

@Component({
  selector: 'food-web-delivery-donation-info',
  templateUrl: './delivery-donation-info.component.html',
  styleUrls: ['./delivery-donation-info.component.scss'],
})
export class DeliveryDonationInfoComponent implements OnInit {

  @Input() donation: Donation;

  constructor() {}

  ngOnInit() {}

}
