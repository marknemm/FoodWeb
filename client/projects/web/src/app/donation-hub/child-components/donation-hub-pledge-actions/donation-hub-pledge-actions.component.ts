import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DonationHubPledge } from '~shared';
import { Convert } from '~web/component-decorators';

@Component({
  selector: 'foodweb-donation-hub-pledge-actions',
  templateUrl: './donation-hub-pledge-actions.component.html',
  styleUrls: ['./donation-hub-pledge-actions.component.scss']
})
export class DonationHubPledgeActionsComponent implements OnInit {

  @Convert()
  @Input() canModify: boolean = false;
  @Input() donationHubPledge: DonationHubPledge;

  @Output() delete = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}
}
