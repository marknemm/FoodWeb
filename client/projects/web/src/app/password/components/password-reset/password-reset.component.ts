import { Component, OnInit } from '@angular/core';

import { PasswordForm } from '~web/password.form';
import { PasswordResetService } from '~web/password-reset/password-reset.service';

@Component({
  selector: 'food-web-password-reset',
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
