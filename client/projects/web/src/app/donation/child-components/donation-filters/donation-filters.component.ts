import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DonationReadRequest, DonationSortBy } from '~shared';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
import { SortByOpt } from '~web/filtered-list/interfaces/sort-by-opt';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-donation-filters',
  templateUrl: './donation-filters.component.html',
  styleUrls: ['./donation-filters.component.scss'],
  providers: formProvider(DonationFiltersComponent)
})
export class DonationFiltersComponent extends FormBaseComponent<DonationFiltersForm> implements OnInit {

  @Output() clear = new EventEmitter<void>();
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
    public constantsService: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(() => new DonationFiltersForm(), formHelperService);
  }

  ngOnInit() {}
}
