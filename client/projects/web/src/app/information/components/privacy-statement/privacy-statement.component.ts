import { Component } from '@angular/core';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-privacy-statement',
  templateUrl: './privacy-statement.component.html',
  styleUrls: ['./privacy-statement.component.scss']
})
export class PrivacyStatementComponent {

  constructor(pageTitleService: PageTitleService) {
    pageTitleService.title = 'Privacy Statement';
  }

}
