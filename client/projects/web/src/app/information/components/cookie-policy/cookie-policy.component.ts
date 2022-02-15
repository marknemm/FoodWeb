import { Component } from '@angular/core';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss']
})
export class CookiePolicyComponent {

  constructor(pageTitleService: PageTitleService) {
    pageTitleService.title = 'Cookie Policy';
  }

}
