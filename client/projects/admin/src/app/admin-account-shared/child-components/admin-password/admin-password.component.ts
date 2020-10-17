import { Component } from '@angular/core';
import { PasswordComponent } from '~web/account-shared/child-components/password/password.component';

@Component({
  selector: 'foodweb-admin-password',
  templateUrl: './admin-password.component.html',
  styleUrls: ['./admin-password.component.scss'],
})
export class AdminPasswordComponent extends PasswordComponent {}
