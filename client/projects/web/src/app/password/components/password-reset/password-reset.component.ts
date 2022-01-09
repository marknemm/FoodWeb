import { Component } from '@angular/core';
import { PasswordForm } from '~web/password/forms/password.form';
import { PasswordResetService } from '~web/password/services/password-reset/password-reset.service';

@Component({
  selector: 'foodweb-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent {

  passwordResetForm = new PasswordForm({ formMode: 'Signup' });
  passwordResetComplete = false;

  constructor(
    protected _passwordResetService: PasswordResetService
  ) {}

  submit(): void {
    if (this.passwordResetForm.valid) {
      this._passwordResetService.resetPassword(this.passwordResetForm.get('password').value).subscribe(
        () => this.passwordResetComplete = true
      );
    }
  }

}
