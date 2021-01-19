import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DonationHub } from '~shared';
import { DonationHubPrivileges } from '~web/donation-hub/interfaces/donation-hub-privileges';

@Component({
  selector: 'foodweb-donation-hub-actions',
  templateUrl: './donation-hub-actions.component.html',
  styleUrls: ['./donation-hub-actions.component.scss']
})
export class DonationHubActionsComponent implements OnInit {

  @Input() donationHub: DonationHub;
  @Input() privileges: DonationHubPrivileges = {};

  @Output() delete = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}
}
