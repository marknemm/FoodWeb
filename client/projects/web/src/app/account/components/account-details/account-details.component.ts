import { Component } from '@angular/core';
import { formProvider } from '~web/forms';
import { AccountDetailsBaseComponent } from './account-details.base.component';

@Component({
  selector: 'foodweb-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
  providers: formProvider(AccountDetailsComponent)
})
export class AccountDetailsComponent extends AccountDetailsBaseComponent {}
