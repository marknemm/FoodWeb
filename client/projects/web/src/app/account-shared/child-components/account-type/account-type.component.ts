import { Component } from '@angular/core';
import { formProvider } from '~web/forms';
import { AccountTypeBaseComponent } from './account-type.base.component';

@Component({
  selector: 'foodweb-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss'],
  providers: formProvider(AccountTypeComponent)
})
export class AccountTypeComponent extends AccountTypeBaseComponent {}
