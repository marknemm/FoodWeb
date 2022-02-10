import { Component } from '@angular/core';
import { SessionService } from '~hybrid/session/services/session/session.service';

@Component({
  selector: 'foodweb-hybrid-donation-hub-portal',
  templateUrl: './donation-hub-portal.component.html',
  styleUrls: ['./donation-hub-portal.component.scss']
})
export class DonationHubPortalComponent {

  constructor(
    public sessionService: SessionService
  ) {}
}
