import { Component, OnInit } from '@angular/core';
import { faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-donation-hub-portal',
  templateUrl: './donation-hub-portal.component.html',
  styleUrls: ['./donation-hub-portal.component.scss']
})
export class DonationHubPortalComponent implements OnInit {

  readonly faHandHoldingHeart = faHandHoldingHeart;

  constructor(
    private _pageTitleService: PageTitleService
  ) {}

  ngOnInit() {
    this._pageTitleService.title = 'Sandwich Army';
  }

}
