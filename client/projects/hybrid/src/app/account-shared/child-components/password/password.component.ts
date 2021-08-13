import { Component } from '@angular/core';
import { PasswordComponent as WebPasswordComponent } from '~web/account-shared/child-components/password/password.component';

@Component({
  selector: 'foodweb-hybrid-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent extends WebPasswordComponent {}
