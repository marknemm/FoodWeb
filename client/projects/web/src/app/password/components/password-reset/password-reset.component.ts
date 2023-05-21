import { Component } from '@angular/core';
import { PasswordForm, PasswordFormAdapter } from '~web/password/services/password-form-adapter/password-form-adapter.service';
import { PasswordResetService } from '~web/password/services/password-reset/password-reset.service';

@Component({
  selector: 'foodweb-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent {

  readonly passwordResetForm: PasswordForm = this._passwordFormAdapter.toForm({ formMode: 'Signup' });

  private _passwordResetComplete = false;

  constructor(
    protected _passwordFormAdapter: PasswordFormAdapter,
    protected _passwordResetService: PasswordResetService
  ) {}

  get passwordResetComplete(): boolean {
    return this._passwordResetComplete;
  }

  submit(): void {
    if (this.passwordResetForm.valid) {
      this._passwordResetService.resetPassword(this.passwordResetForm.get('password').value).subscribe(
        () => this._passwordResetComplete = true
      );
    }
  }

}
