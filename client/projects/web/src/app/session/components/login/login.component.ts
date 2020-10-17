import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsernameRecoveryService } from '~web/account/services/username-recovery/username-recovery.service';
import { PasswordResetService } from '~web/password/services/password-reset/password-reset.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { LoginBaseComponent, LoginFormChange } from './login.base.component';
export { LoginFormChange };

@Component({
  selector: 'foodweb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends LoginBaseComponent {

  constructor(
    activatedRoute: ActivatedRoute,
    authService: AuthenticationService,
    passwordResetService: PasswordResetService,
    usernameRecoveryService: UsernameRecoveryService
  ) {
    super(activatedRoute, authService, passwordResetService, usernameRecoveryService);
  }
}
