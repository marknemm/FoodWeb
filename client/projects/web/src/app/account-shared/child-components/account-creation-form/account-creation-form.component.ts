import { Component } from '@angular/core';
import { formProvider } from '~web/data-structure/form-base-component';
import { AccountCreationFormBaseComponent } from './account-creation-form.base.component';

@Component({
  selector: 'foodweb-account-creation-form',
  templateUrl: './account-creation-form.component.html',
  styleUrls: ['./account-creation-form.component.scss'],
  providers: formProvider(AccountCreationFormComponent)
})
export class AccountCreationFormComponent extends AccountCreationFormBaseComponent {}
