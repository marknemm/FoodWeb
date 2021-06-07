import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DonationHubPledge } from '~shared';

@Component({
  selector: 'foodweb-donation-hub-pledge-actions',
  templateUrl: './donation-hub-pledge-actions.component.html',
  styleUrls: ['./donation-hub-pledge-actions.component.scss']
})
export class DonationHubPledgeActionsComponent implements OnInit {

  @Input() canModify: boolean;
  @Input() donationHubPledge: DonationHubPledge;

  @Output() delete = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}
}
