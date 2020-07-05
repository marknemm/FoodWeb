import { Component, Input, OnInit } from '@angular/core';
import { Donation } from '~shared';

@Component({
  selector: 'food-web-delivery-teaser',
  templateUrl: './delivery-teaser.component.html',
  styleUrls: ['./delivery-teaser.component.scss'],
})
export class DeliveryTeaserComponent implements OnInit {

  @Input() donation: Donation;

  constructor() {}

  ngOnInit() {}

}
