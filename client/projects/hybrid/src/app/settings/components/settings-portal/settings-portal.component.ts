import { Component, OnInit } from '@angular/core';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';

@Component({
  selector: 'foodweb-hybrid-settings-portal',
  templateUrl: './settings-portal.component.html',
  styleUrls: ['./settings-portal.component.scss']
})
export class SettingsPortalComponent implements OnInit {

  constructor(
    private _authenticationService: AuthenticationService,
    private _sessionService: SessionService
  ) {}

  ngOnInit(): void {}

  logout(): void {
    this._authenticationService.logout();
  }

}
