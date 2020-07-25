import { Component, OnInit } from '@angular/core';
import { PasswordResetService } from '~web/password/password-reset/password-reset.service';
import { PasswordForm } from '~web/password/password.form';

@Component({
  selector: 'foodweb-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  passwordResetForm = new PasswordForm({ formMode: 'Signup' });
  passwordResetComplete = false;

  constructor(
    private _passwordResetService: PasswordResetService
  ) {}

  ngOnInit() {}

  submit(): void {
    if (this.passwordResetForm.valid) {
      this._passwordResetService.resetPassword(this.passwordResetForm.get('password').value).subscribe(
        () => this.passwordResetComplete = true
      );
    }
  }

}
