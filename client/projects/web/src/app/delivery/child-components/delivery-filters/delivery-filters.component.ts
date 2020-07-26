import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DonationReadRequest, DonationSortBy, DonationStatus } from '~shared';
import { DonationFiltersForm } from '~web/donation-delivery-shared/forms/donation-filters.form';
import { SortByOpt } from '~web/filtered-list/interfaces/sort-by-opt';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-delivery-filters',
  templateUrl: './delivery-filters.component.html',
  styleUrls: ['./delivery-filters.component.scss'],
})
export class DeliveryFiltersComponent implements OnInit, OnChanges {

  @Input() activeFilters: DonationReadRequest = {};
  @Input() myDeliveries = false;

  @Output() filter = new EventEmitter<DonationReadRequest>();

  /**
   * Options for sorting dropdown.
   */
  readonly sortByOpts: SortByOpt<DonationSortBy>[] = [
    { name: 'Delivery Window', value: 'deliveryWindowStart' },
    { name: 'Donation Status', value: 'donationStatus' },
    { name: 'Donor Organization', value: 'donorOrganizationName' },
    { name: 'Receiver Organization', value: 'receiverOrganizationName' }
  ];

  readonly filtersForm = new DonationFiltersForm();

  private _donationStatuses: DonationStatus[];

  constructor(
    public constantsService: ConstantsService
  ) {}

  get donationStatuses(): DonationStatus[] {
    return this._donationStatuses;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.myDeliveries) {
      this._donationStatuses = this.constantsService.getDeliveryStatuses(!this.myDeliveries);
    }
    if (changes.activeFilters) {
      this.filtersForm.patchValue(this.activeFilters);
    }
  }

}
