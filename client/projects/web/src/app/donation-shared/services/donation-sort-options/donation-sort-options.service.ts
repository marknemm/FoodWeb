import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationSortBy } from '~shared';
import { SortOption } from '~web/page-list/interfaces/sort-by-opt';

@Injectable()
export class DonationSortOptionsService {

  /**
   * Options for sorting dropdown.
   */
  private readonly _options: SortOption<DonationSortBy>[] = [
    { name: 'Delivery Window', value: 'deliveryWindowStart' },
    { name: 'Donation Date', value: 'createTimestamp' },
    { name: 'Donation Status', value: 'donationStatus' },
    { name: 'Donor Organization', value: 'donorOrganizationName' },
    { name: 'Receiver Organization', value: 'receiverOrganizationName' }
  ];

  constructor(
    private _router: Router,
    activatedRoute: ActivatedRoute,
  ) {
    this.refresh();
    activatedRoute.url.subscribe(() => this.refresh())
  }

  /**
   * The {@link SortOption} list with each element of type {@link DonationSortBy}.
   */
  get options(): readonly SortOption<DonationSortBy>[] {
    return this._options;
  }

  /**
   * Refreshes the contained sort by options based on the current URL state.
   * @param isDonationDelivery Whether or not the sort options are for donation deliveries.
   */
  refresh(isDonationDelivery: boolean = this._isDonationDelivery()): void {
    if (isDonationDelivery && this._options.length === 4) {
      this._options.push({ name: 'Receiver Organization', value: 'receiverOrganizationName' });
    } else if (!isDonationDelivery && this._options.length === 5) {
      this._options.pop();
    }
  }

  /**
   * @returns true if the current URL designates that the sort options for for donation deliveries, false if not.
   */
  private _isDonationDelivery(): boolean {
    return (this._router.url.indexOf('delivery/list') >= 0);
  }
}
