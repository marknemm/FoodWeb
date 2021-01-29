import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DonationHub } from '~shared';
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
  @Input() donationHub: DonationHub;

  @Output() delete = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}
}
