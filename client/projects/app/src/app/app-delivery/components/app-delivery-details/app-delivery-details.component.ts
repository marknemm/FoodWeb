import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DonationActionsService } from '~web/donation-delivery-shared/services/donation-actions/donation-actions.service';
import { DonationReadService } from '~web/donation/services/donation-read/donation-read.service';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-app-delivery-details',
  templateUrl: './app-delivery-details.component.html',
  styleUrls: ['./app-delivery-details.component.scss']
})
export class AppDeliveryDetailsComponent implements OnInit {

  constructor(
    public sessionService: SessionService,
    protected _activatedRoute: ActivatedRoute,
    protected _donationActionsService: DonationActionsService,
    protected _donationReadService: DonationReadService
  ) {}

  ngOnInit() {}

}
