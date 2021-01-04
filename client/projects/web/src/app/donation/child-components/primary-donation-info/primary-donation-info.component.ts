import { Component, Input, OnInit } from '@angular/core';
import { Donation } from '~shared';
import { Convert } from '~web/component-decorators';

@Component({
  selector: 'foodweb-primary-donation-info',
  templateUrl: './primary-donation-info.component.html',
  styleUrls: ['./primary-donation-info.component.scss'],
})
export class PrimaryDonationInfoComponent implements OnInit {

  @Input() donation: Donation;
  @Convert()
  @Input() myDonation: boolean = false;

  constructor() {}

  ngOnInit() {}

}
