import { Component } from '@angular/core';
import { faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-donation-hub-portal',
  templateUrl: './donation-hub-portal.component.html',
  styleUrls: ['./donation-hub-portal.component.scss']
})
export class DonationHubPortalComponent {

  readonly faHandHoldingHeart = faHandHoldingHeart;

  constructor(
    shellService: ShellService
  ) {
    shellService.pageTitle = 'Sandwich Army';
  }

}
