import { Component, Input } from '@angular/core';
import { DonationActionsComponent as WebDonationActionsComponent } from '~web/donation-shared/child-components/donation-actions/donation-actions.component';

@Component({
  selector: 'foodweb-hybrid-donation-actions',
  templateUrl: './donation-actions.component.html',
  styleUrls: ['./donation-actions.component.scss']
})
export class DonationActionsComponent extends WebDonationActionsComponent {

  @Input() header = false;
  @Input() loading = false;

}
