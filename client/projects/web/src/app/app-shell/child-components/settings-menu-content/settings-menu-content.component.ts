import { Component, OnInit } from '@angular/core';
import { SessionService } from '~web/session/session.service';

@Component({
  selector: 'food-web-settings-menu-content',
  templateUrl: './settings-menu-content.component.html',
  styleUrls: ['./settings-menu-content.component.scss'],
})
export class SettingsMenuContentComponent implements OnInit {

  constructor(
    public sessionService: SessionService
  ) {}

  ngOnInit() {}
}
