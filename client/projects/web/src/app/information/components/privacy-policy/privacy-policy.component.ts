import { Component } from '@angular/core';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {

  constructor(pageTitleService: PageTitleService) {
    pageTitleService.title = 'Privacy Policy';
  }

}
