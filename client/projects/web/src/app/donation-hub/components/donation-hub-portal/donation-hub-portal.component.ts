import { Component, OnInit } from '@angular/core';
import { faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'foodweb-donation-hub-portal',
  templateUrl: './donation-hub-portal.component.html',
  styleUrls: ['./donation-hub-portal.component.scss']
})
export class DonationHubPortalComponent implements OnInit {

  readonly faHandHoldingHeart = faHandHoldingHeart;

  constructor() {}

  ngOnInit() {}

}
