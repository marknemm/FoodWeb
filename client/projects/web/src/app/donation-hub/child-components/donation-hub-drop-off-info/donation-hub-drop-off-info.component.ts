import { Component, Input, OnInit } from '@angular/core';
import { DonationHub } from '~shared';

@Component({
  selector: 'foodweb-donation-hub-drop-off-info',
  templateUrl: './donation-hub-drop-off-info.component.html',
  styleUrls: ['./donation-hub-drop-off-info.component.scss']
})
export class DonationHubDropOffInfoComponent implements OnInit {

  @Input() donationHub: DonationHub;

  constructor() {}

  ngOnInit() {}
}
