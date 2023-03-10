import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginDialogComponent } from '~web/session/components/login-dialog/login-dialog.component';
import { LoginForm, LoginFormMode } from '~web/session/forms/login.form';
import { LoginSubmitService } from '~web/session/services/login-submit/login-submit.service';

@Component({
  selector: 'foodweb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginSubmitService]
})
export class LoginComponent {

  readonly loginForm = new LoginForm();

  @Input() dialogRef: MatDialogRef<LoginDialogComponent> = null;

  @Output() formChanged = new EventEmitter<LoginFormMode>();
  @Output() loggedIn = new EventEmitter<void>();

  constructor(
    public loginSubmitService: LoginSubmitService,
  ) {
    this.loginForm.mode$.subscribe((mode: LoginFormMode) => {
      this.loginSubmitService.reset();
      this.formChanged.emit(mode);
    });
    this.loginSubmitService.loggedIn$.subscribe(() => this.loggedIn.emit());
  }

  submit(): void {
    if (this.loginForm.valid) {
      this.loginSubmitService.submit(this.loginForm.usernameEmail, this.loginForm.password, this.loginForm.mode);
    }
  }

}
