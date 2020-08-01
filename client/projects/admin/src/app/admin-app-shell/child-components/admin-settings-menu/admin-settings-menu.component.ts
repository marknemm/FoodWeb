import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-admin-settings-menu',
  templateUrl: './admin-settings-menu.component.html',
  styleUrls: [
    '../../../../../../web/src/app/app-shell/child-components/settings-menu/settings-menu.component.scss',
    './admin-settings-menu.component.scss'
  ],
})
export class AdminSettingsMenuComponent implements OnInit {

  constructor(
    public authService: AuthenticationService,
    public sessionService: SessionService
  ) {}

  ngOnInit() {}

}
