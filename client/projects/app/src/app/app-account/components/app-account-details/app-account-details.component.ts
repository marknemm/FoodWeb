import { Component } from '@angular/core';
import { AccountDetailsBaseComponent } from '~web/account/components/account-details/account-details.base.component';

@Component({
  selector: 'foodweb-app-account-details',
  templateUrl: './app-account-details.component.html',
  styleUrls: ['./app-account-details.component.scss']
})
export class AppAccountDetailsComponent extends AccountDetailsBaseComponent {}
