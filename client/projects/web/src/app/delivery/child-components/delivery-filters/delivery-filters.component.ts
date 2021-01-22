import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DonationReadRequest, DonationSortBy, DonationStatus } from '~shared';
import { Convert } from '~web/component-decorators';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
import { SortByOpt } from '~web/filtered-list/interfaces/sort-by-opt';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-delivery-filters',
  templateUrl: './delivery-filters.component.html',
  styleUrls: ['./delivery-filters.component.scss'],
  providers: formProvider(DeliveryFiltersComponent)
})
export class DeliveryFiltersComponent extends FormBaseComponent<DonationFiltersForm> implements OnInit, OnChanges {

  @Convert()
  @Input() myDeliveries: boolean = false;

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
    formHelperService: FormHelperService
  ) {
    super(() => new DonationFiltersForm(), formHelperService);
  }

  get donationStatuses(): DonationStatus[] {
    return this._donationStatuses;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.myDeliveries) {
      this._donationStatuses = this.constantsService.getDeliveryStatuses(!this.myDeliveries);
    }
    super.ngOnChanges(changes);
  }

}
