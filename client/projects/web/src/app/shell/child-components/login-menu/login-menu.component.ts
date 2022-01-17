import { Component } from '@angular/core';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';

@Component({
  selector: 'foodweb-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.scss']
})
export class LoginMenuComponent {

  constructor(
    private _authService: AuthenticationService,
  ) {}

  showLoginDialog(): void {
    this._authService.openLoginDialogIfNotLoggedIn();
  }

}
