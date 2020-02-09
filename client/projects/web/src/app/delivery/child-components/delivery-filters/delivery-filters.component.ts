import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DonationReadRequest, DonationSortBy, DonationStatus } from '~shared';
import { DonationFiltersForm } from '~web/donation-delivery-shared/donation-filters.form';
import { ConstantsService } from '~web/shared/constants/constants.service';

@Component({
  selector: 'food-web-delivery-filters',
  templateUrl: './delivery-filters.component.html',
  styleUrls: ['./delivery-filters.component.scss'],
})
export class DeliveryFiltersComponent implements OnInit {

  @Input() myDeliveries = false;

  @Output() filter = new EventEmitter<DonationReadRequest>();

  /**
   * Options for sorting dropdown.
   */
  readonly sortByOpts: DeliverySortByOption[] = [
    { name: 'Delivery Window', value: 'deliveryWindowStart' },
    { name: 'Donation Status', value: 'donationStatus' },
    { name: 'Donor Organization', value: 'donorOrganizationName' },
    { name: 'Receiver Organization', value: 'receiverOrganizationName' }
  ];
  readonly donationStatuses: DonationStatus[];

  filtersForm = new DonationFiltersForm();

  constructor(
    public constantsService: ConstantsService,
    private _activatedRoute: ActivatedRoute
  ) {
    this.donationStatuses = this.constantsService.DONATION_STATUSES.filter((status: DonationStatus) =>
      (status !== DonationStatus.Unmatched) && (status !== DonationStatus.Matched)
    );
  }

  ngOnInit() {
    if (!this.myDeliveries) {
      this.donationStatuses.unshift(DonationStatus.Matched);
    }
    this._activatedRoute.queryParams.subscribe((currentFilters: Params) =>
      this.filtersForm.patchValue(currentFilters)
    );
  }

}

export interface DeliverySortByOption {
  name: string;
  value: DonationSortBy;
}
