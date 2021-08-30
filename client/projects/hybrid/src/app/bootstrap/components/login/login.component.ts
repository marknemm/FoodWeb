import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInput, IonRouterOutlet } from '@ionic/angular';
import { UsernameRecoveryService } from '~web/account/services/username-recovery/username-recovery.service';
import { PasswordResetService } from '~web/password/services/password-reset/password-reset.service';
import { LoginComponent as WebLoginComponent } from '~web/session/components/login/login.component';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';

@Component({
  selector: 'foodweb-hybrid-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends WebLoginComponent {

  @ViewChild('password', { static: false }) password: IonInput;

  constructor(
    protected _activatedRoute: ActivatedRoute,
    protected _authService: AuthenticationService,
    protected _passwordResetService: PasswordResetService,
    protected _usernameRecoveryService: UsernameRecoveryService,
    private _routerOutlet: IonRouterOutlet,
  ) {
    super(_activatedRoute, _authService, _passwordResetService, _usernameRecoveryService);
  }

  ionViewWillEnter(): void {
    this._routerOutlet.swipeGesture = false;
  }

  ionViewWillLeave(): void {
    this._routerOutlet.swipeGesture = true;
  }

}
