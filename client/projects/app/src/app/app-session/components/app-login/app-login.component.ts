import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppAuthenticationService } from '~app/app-session/services/app-authentication/app-authentication.service';
import { AppLeftNavService } from '~app/app-shell/services/app-left-nav/app-left-nav.service';
import { UsernameRecoveryService } from '~web/account/services/username-recovery/username-recovery.service';
import { PasswordResetService } from '~web/password/services/password-reset/password-reset.service';
import { LoginBaseComponent, LoginFormChange } from '~web/session/components/login/login.base.component';
export { LoginFormChange };

@Component({
  selector: 'foodweb-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss']
})
export class AppLoginComponent extends LoginBaseComponent implements OnInit, OnDestroy {

  constructor(
    private _leftNavService: AppLeftNavService,
    activatedRoute: ActivatedRoute,
    authService: AppAuthenticationService,
    passwordResetService: PasswordResetService,
    usernameRecoveryService: UsernameRecoveryService
  ) {
    super(activatedRoute, authService, passwordResetService, usernameRecoveryService);
  }

  ngOnInit() {
    super.ngOnInit();
    this._leftNavService.lock();
  }

  ngOnDestroy() {
    this._leftNavService.unlock();
  }
}
