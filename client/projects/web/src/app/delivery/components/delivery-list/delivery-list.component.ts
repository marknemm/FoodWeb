import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeliveryHelper, Donation, DonationHelper, DonationStatus } from '~shared';
import { DeliveryReadService } from '~web/delivery/services/delivery-read/delivery-read.service';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
import { DonationSortOptionsService } from '~web/donation-shared/services/donation-sort-options/donation-sort-options.service';
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

  readonly filtersForm = new DonationFiltersForm();

  private _donationStatuses: DonationStatus[] = [];
  private _myDeliveries = false;

  constructor(
    public constantsService: ConstantsService,
    public deliveryHelper: DeliveryHelper,
    public donationHelper: DonationHelper,
    public donationSortOptionsService: DonationSortOptionsService,
    public listQueryService: ListQueryService<Donation>,
    public shellService: ShellService,
    private _deliveryReadService: DeliveryReadService,
    private _router: Router,
  ) {}

  get donationStatuses(): DonationStatus[] {
    return this._donationStatuses;
  }

  get myDeliveries(): boolean {
    return this._myDeliveries;
  }

  ngOnInit(): void {
    this._myDeliveries = this._router.url.indexOf('/my') >= 0;
    this._donationStatuses = this.constantsService.getDeliveryStatuses(!this.myDeliveries);
    this.shellService.pageTitle = (this.myDeliveries)
      ? 'My Deliveries'
      : 'Schedule Deliveries';
    this.listQueryService.load(
      this._deliveryReadService.getDeliveries.bind(this._deliveryReadService),
      this.filtersForm
    );
  }

}
