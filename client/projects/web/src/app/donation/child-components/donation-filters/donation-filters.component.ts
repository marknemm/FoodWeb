import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DonationSortBy } from '~shared';
import { DonationFiltersForm, DonationReadRequest } from '~web/donation-delivery-shared/donation-filters.form';
import { SortByOpt } from '~web/filtered-list/sort-by-opt';
import { ConstantsService } from '~web/shared/constants/constants.service';

@Component({
  selector: 'food-web-donation-filters',
  templateUrl: './donation-filters.component.html',
  styleUrls: ['./donation-filters.component.scss'],
})
export class DonationFiltersComponent implements OnInit {

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

  filtersForm = new DonationFiltersForm();

  constructor(
    public constantsService: ConstantsService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe((currentFilters: Params) =>
      this.filtersForm.patchValue(currentFilters)
    );
  }

}
