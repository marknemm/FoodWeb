import { Component } from '@angular/core';
import { PasswordResetComponent as WebPasswordResetComponent } from '~web/password/components/password-reset/password-reset.component';

@Component({
  selector: 'foodweb-hybrid-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent extends WebPasswordResetComponent {}
