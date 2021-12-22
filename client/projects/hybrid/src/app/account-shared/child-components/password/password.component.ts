import { Component } from '@angular/core';
import { PasswordComponent as WebPasswordComponent } from '~web/account-shared/child-components/password/password.component';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  providers: [FormFieldService]
})
export class PasswordComponent extends WebPasswordComponent {}
