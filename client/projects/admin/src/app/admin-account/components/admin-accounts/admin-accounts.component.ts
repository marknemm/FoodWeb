import { Component } from '@angular/core';
import { AccountsComponent } from '~web/account/components/accounts/accounts.component';

@Component({
  selector: 'foodweb-admin-accounts',
  templateUrl: './admin-accounts.component.html',
  styleUrls: ['./admin-accounts.component.scss']
})
export class AdminAccountsComponent extends AccountsComponent {}
