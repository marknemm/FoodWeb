import { Component, OnInit } from '@angular/core';
import { SessionService } from '~web/session/session/session.service';

@Component({
  selector: 'food-web-admin-settings-menu',
  templateUrl: './admin-settings-menu.component.html',
  styleUrls: [
    '../../../../../../web/src/app/app-shell/child-components/settings-menu/settings-menu.component.scss',
    './admin-settings-menu.component.scss'
  ],
})
export class AdminSettingsMenuComponent implements OnInit {

  constructor(
    public sessionService: SessionService
  ) {}

  ngOnInit() {}

}
