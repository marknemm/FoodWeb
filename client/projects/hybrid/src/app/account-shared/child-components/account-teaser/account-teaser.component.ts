import { Component } from '@angular/core';
import { AccountTeaserComponent as WebAccountTeaserComponent } from '~web/account-shared/child-components/account-teaser/account-teaser.component';

@Component({
  selector: 'foodweb-hybrid-account-teaser',
  templateUrl: './account-teaser.component.html',
  styleUrls: ['./account-teaser.component.scss']
})
export class AccountTeaserComponent extends WebAccountTeaserComponent {}
