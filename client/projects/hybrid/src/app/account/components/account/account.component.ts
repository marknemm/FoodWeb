import { Component } from '@angular/core';
import { AccountComponent as WebAccountComponent } from '~web/account/components/account/account.component';
import { formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: formProvider(AccountComponent)
})
export class AccountComponent extends WebAccountComponent {}
