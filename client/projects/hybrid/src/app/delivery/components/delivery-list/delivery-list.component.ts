import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Donation, DonationStatus } from '~shared';
import { DeliveryReadService } from '~web/delivery/services/delivery-read/delivery-read.service';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
import { DonationSortOptionsService } from '~web/donation-shared/services/donation-sort-options/donation-sort-options.service';
import { SessionService } from '~web/session/services/session/session.service';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';

@Component({
  selector: 'foodweb-hybrid-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss'],
  providers: [DonationSortOptionsService, ListQueryService]
})
export class DeliveryListComponent {

  readonly filtersForm = new DonationFiltersForm();

  private _myDeliveries = false;

  constructor(
    public constantsService: ConstantsService,
    public donationSortOptionsService: DonationSortOptionsService,
    public listQueryService: ListQueryService<Donation>,
    private _deliveryReadService: DeliveryReadService,
    private _router: Router,
    private _sessionService: SessionService,
  ) {}

  get defaultBackHref(): string {
    return (this._sessionService.isVolunteer ? '..' : '/donation');
  }

  get isScheduleList(): boolean {
    return (this.filtersForm.get('donationStatus').value === DonationStatus.Matched);
  }

  get myDeliveries(): boolean {
    return this._myDeliveries;
  }

  get pageTitle(): string {
    return (this._myDeliveries)
      ? 'My Deliveries'
      : (this.isScheduleList)
        ? 'Schedule Deliveries'
        : 'Deliveries';
  }

  ionViewWillEnter(): void {
    this._myDeliveries = this._router.url.indexOf('/my') >= 0;
    if (!this.listQueryService.items.length) { // Only do initial load if items have not already loaded.
      this.listQueryService.load(
        this._deliveryReadService.getDeliveries.bind(this._deliveryReadService),
        this.filtersForm
      );
    }
  }
}
