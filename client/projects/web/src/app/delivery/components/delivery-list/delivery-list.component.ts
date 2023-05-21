import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Donation, DonationSortBy, DonationStatus } from '~shared';
import { DeliveryReadService } from '~web/delivery/services/delivery-read/delivery-read.service';
import { DonationFilterForm, DonationFilterFormAdapter } from '~web/donation-shared/services/donation-filter-form-adapter/donation-filter-form-adapter.service';
import { DonationSortOptionsService } from '~web/donation-shared/services/donation-sort-options/donation-sort-options.service';
import { SortOption } from '~web/page-list/interfaces/sort-by-opt';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss'],
  providers: [DonationSortOptionsService, ListQueryService]
})
export class DeliveryListComponent implements OnInit {

  readonly filtersForm: DonationFilterForm = this._donationFilterFormAdapter.toForm();

  private _donationStatuses: DonationStatus[] = [];
  private _myDeliveries = false;

  constructor(
    public constantsService: ConstantsService,
    private _deliveryReadService: DeliveryReadService,
    private _donationSortOptionsService: DonationSortOptionsService,
    private _donationFilterFormAdapter: DonationFilterFormAdapter,
    private _listQueryService: ListQueryService<Donation>,
    private _router: Router,
    private _shellService: ShellService,
  ) {}

  get donations(): readonly Donation[] {
    return this._listQueryService.items;
  }

  get donationStatuses(): DonationStatus[] {
    return this._donationStatuses;
  }

  get myDeliveries(): boolean {
    return this._myDeliveries;
  }

  get noneFound(): boolean {
    return this._listQueryService.noneFound;
  }

  get pageTitle(): string {
    return this._shellService.pageTitle;
  }

  get sortOptions(): readonly SortOption<DonationSortBy>[] {
    return this._donationSortOptionsService.options;
  }

  get totalCount(): number {
    return this._listQueryService.totalCount;
  }

  ngOnInit(): void {
    this._myDeliveries = this._router.url.indexOf('/my') >= 0;
    this._donationStatuses = this.constantsService.getDeliveryStatuses(!this.myDeliveries);
    this._shellService.pageTitle = (this.myDeliveries)
      ? 'My Deliveries'
      : 'Schedule Deliveries';
    this._listQueryService.load(
      this._deliveryReadService.getDeliveries.bind(this._deliveryReadService),
      this.filtersForm,
      this._donationFilterFormAdapter
    );
  }

  refresh(): void {
    this._listQueryService.refresh();
  }

  resetFacetFilters(): void {
    this.filtersForm.reset({ fullTextQuery: this.filtersForm.controls.fullTextQuery.value });
  }

}
