import { Component } from '@angular/core';
import { DonationHubDropOffInfoComponent as WebDonationHubDropOffInfoComponent } from '~web/donation-hub/child-components/donation-hub-drop-off-info/donation-hub-drop-off-info.component';

@Component({
  selector: 'foodweb-hybrid-donation-hub-drop-off-info',
  templateUrl: './donation-hub-drop-off-info.component.html',
  styleUrls: ['./donation-hub-drop-off-info.component.scss']
})
export class DonationHubDropOffInfoComponent extends WebDonationHubDropOffInfoComponent {}
