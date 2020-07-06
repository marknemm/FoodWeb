import { Component, Input, OnInit } from '@angular/core';
import { AccountType, Donation } from '~shared';

@Component({
  selector: 'food-web-delivery-teaser',
  templateUrl: './delivery-teaser.component.html',
  styleUrls: ['./delivery-teaser.component.scss'],
})
export class DeliveryTeaserComponent implements OnInit {

  readonly AccountType = AccountType;

  @Input() donation: Donation;

  constructor() {}

  ngOnInit() {}

}
