import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DonationHubPledge } from '~shared';

@Component({
  selector: 'foodweb-hybrid-donation-hub-pledge-mini-list',
  templateUrl: './donation-hub-pledge-mini-list.component.html',
  styleUrls: ['./donation-hub-pledge-mini-list.component.scss']
})
export class DonationHubPledgeMiniListComponent {

  @Input() loading = false;
  @Input() pledges: DonationHubPledge[] = [];

  @Output() select = new EventEmitter<DonationHubPledge>();
}
