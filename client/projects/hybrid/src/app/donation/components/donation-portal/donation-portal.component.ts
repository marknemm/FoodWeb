import { Component, OnInit } from '@angular/core';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-hybrid-donation-portal',
  templateUrl: './donation-portal.component.html',
  styleUrls: ['./donation-portal.component.scss']
})
export class DonationPortalComponent implements OnInit {

  constructor(
    public sessionService: SessionService
  ) {}

  ngOnInit(): void {}

}
