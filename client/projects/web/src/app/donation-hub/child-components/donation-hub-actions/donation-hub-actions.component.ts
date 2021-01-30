import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DonationHub, DonationHubPledge } from '~shared';
import { Convert } from '~web/component-decorators';

@Component({
  selector: 'foodweb-donation-hub-actions',
  templateUrl: './donation-hub-actions.component.html',
  styleUrls: ['./donation-hub-actions.component.scss']
})
export class DonationHubActionsComponent implements OnInit {

  @Convert()
  @Input() canDonate: boolean = false;
  @Convert()
  @Input() canModify: boolean = false;
  @Convert()
  @Input() canViewDonation: boolean = false;
  @Input() donationHub: DonationHub;
  @Convert()
  @Input() loading: boolean = false;
  @Input() myPledge: DonationHubPledge;

  @Output() delete = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}
}
