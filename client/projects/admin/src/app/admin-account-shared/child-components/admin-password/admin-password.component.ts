import { Component } from '@angular/core';
import { PasswordComponent } from '~web/account-shared/child-components/password/password.component';
import { formProvider } from '~web/data-structure/form-base-component';

@Component({
  selector: 'foodweb-admin-password',
  templateUrl: './admin-password.component.html',
  styleUrls: ['./admin-password.component.scss'],
  providers: formProvider(AdminPasswordComponent)
})
export class AdminPasswordComponent extends PasswordComponent {}
