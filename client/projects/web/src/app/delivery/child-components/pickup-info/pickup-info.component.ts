import { Component, Input, OnInit } from '@angular/core';
import { Donation } from '~shared';

@Component({
  selector: 'food-web-pickup-info',
  templateUrl: './pickup-info.component.html',
  styleUrls: ['./pickup-info.component.scss'],
})
export class PickupInfoComponent implements OnInit {

  @Input() donation: Donation;

  constructor() {}

  ngOnInit() {}

}
