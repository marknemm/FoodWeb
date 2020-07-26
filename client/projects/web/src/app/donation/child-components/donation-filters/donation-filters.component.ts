import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DonationSortBy } from '~shared';
import { DonationFiltersForm, DonationReadRequest } from '~web/donation-delivery-shared/forms/donation-filters.form';
import { SortByOpt } from '~web/filtered-list/interfaces/sort-by-opt';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-donation-filters',
  templateUrl: './donation-filters.component.html',
  styleUrls: ['./donation-filters.component.scss'],
})
export class DonationFiltersComponent implements OnInit, OnChanges {

  @Input() activeFilters: DonationReadRequest = {};

  @Output() filter = new EventEmitter<DonationReadRequest>();

  /**
   * Options for sorting dropdown.
   */
  readonly sortByOpts: SortByOpt<DonationSortBy>[] = [
    { name: 'Donation Window', value: 'deliveryWindowStart' },
    { name: 'Date Created', value: 'createTimestamp' },
    { name: 'Donation Status', value: 'donationStatus' },
    { name: 'Donor Organization', value: 'donorOrganizationName' }
  ];

  readonly filtersForm = new DonationFiltersForm();

  constructor(
    public constantsService: ConstantsService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.activeFilters) {
      this.filtersForm.patchValue(this.activeFilters);
    }
  }

}
