import { Component } from '@angular/core';
import { DonationHubListComponent as WebDonationHubListComponent } from '~web/donation-hub/components/donation-hub-list/donation-hub-list.component';

@Component({
  selector: 'foodweb-hybrid-donation-hub-list',
  templateUrl: './donation-hub-list.component.html',
  styleUrls: ['./donation-hub-list.component.scss']
})
export class DonationHubListComponent extends WebDonationHubListComponent {

  /**
   * Handles an ionRefresh event by refreshing the Donation Hub List items.
   * @param event The ionRefresh event.
   */
  handleIonRefresh(event: any): void {
    this.refresh().subscribe(() => event.target.complete());
  }
}
