import { Component } from '@angular/core';
import { AccountListComponent } from '~web/account/components/account-list/account-list.component';

@Component({
  selector: 'foodweb-admin-account-list',
  templateUrl: './admin-account-list.component.html',
  styleUrls: ['./admin-account-list.component.scss']
})
export class AdminAccountListComponent extends AccountListComponent {}
