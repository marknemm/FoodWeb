import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DonationReadRequest, DonationSortBy, DonationStatus } from '~shared';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
import { SortByOpt } from '~web/filtered-list/interfaces/sort-by-opt';
import { FormFieldService } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-delivery-filters',
  templateUrl: './delivery-filters.component.html',
  styleUrls: ['./delivery-filters.component.scss'],
  providers: [FormFieldService]
})
export class DeliveryFiltersComponent implements OnChanges, OnInit {

  @Input() myDeliveries = false;

  @Output() clear = new EventEmitter<void>();
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

  private _donationStatuses: DonationStatus[];

  constructor(
    public constantsService: ConstantsService,
    private _formFieldService: FormFieldService<DonationFiltersForm>
  ) {}

  get donationStatuses(): DonationStatus[] {
    return this._donationStatuses;
  }

  get filtersForm(): DonationFiltersForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({ genDefault: () => new DonationFiltersForm() });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.myDeliveries) {
      this._donationStatuses = this.constantsService.getDeliveryStatuses(!this.myDeliveries);
    }
  }

}
