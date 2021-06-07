import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DonationHub, DonationHubPledge } from '~shared';

@Component({
  selector: 'foodweb-donation-hub-actions',
  templateUrl: './donation-hub-actions.component.html',
  styleUrls: ['./donation-hub-actions.component.scss']
})
export class DonationHubActionsComponent implements OnInit {

  @Input() canDonate = false;
  @Input() canModify = false;
  @Input() canViewDonation = false;
  @Input() donationHub: DonationHub;
  @Input() loading = false;
  @Input() myPledge: DonationHubPledge;

  @Output() delete = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}
}
