import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AccountType, DonationStatus } from '~shared';

@Component({
  selector: 'food-web-search-menu',
  templateUrl: './search-menu.component.html',
  styleUrls: ['./search-menu.component.scss'],
})
export class SearchMenuComponent implements OnInit, OnChanges {

  @Input() accountType: AccountType;

  private _routerLink: string[] = [];
  private _queryParmas: { donationStatus: DonationStatus } = { donationStatus: null };
  private _tooltip = '';

  constructor() {}

  get routerLink(): string[] {
    return this._routerLink;
  }

  get queryParams(): { donationStatus: DonationStatus } {
    return this._queryParmas;
  }

  get tooltip(): string {
    return this._tooltip;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.accountType) {
      this._routerLink = (this.accountType === AccountType.Receiver) ? ['/donation/list'] : ['/delivery/list'];
      this._queryParmas = { donationStatus: (this.accountType === AccountType.Receiver) ? DonationStatus.Unmatched : DonationStatus.Matched };
      this._tooltip = (this.accountType === AccountType.Receiver) ? 'Find Donations' : 'Find Deliveries';
    }
  }
}
