import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeliveryDetailsComponent } from '~web/delivery/components/delivery-details/delivery-details.component';
import { DonationActionsService } from '~web/donation-delivery-shared/services/donation-actions/donation-actions.service';
import { DonationReadService } from '~web/donation/services/donation-read/donation-read.service';
import { SessionService } from '~web/session/services/session/session.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-app-delivery-details',
  templateUrl: './app-delivery-details.component.html',
  styleUrls: ['./app-delivery-details.component.scss']
})
export class AppDeliveryDetailsComponent extends DeliveryDetailsComponent implements OnInit {

  constructor(
    public pageTitleService: PageTitleService,
    public sessionService: SessionService,
    protected _activatedRoute: ActivatedRoute,
    protected _donationActionsService: DonationActionsService,
    protected _donationReadService: DonationReadService
  ) {
    super(pageTitleService, sessionService, _activatedRoute, _donationActionsService, _donationReadService);
  }

  ngOnInit() {}

}
