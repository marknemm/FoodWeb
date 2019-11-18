import { Component, OnInit } from '@angular/core';
import { SessionService } from '~web/session/session.service';

@Component({
  selector: 'food-web-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss']
})
export class SettingsMenuComponent implements OnInit {

  constructor(
    public sessionService: SessionService
  ) {}

  ngOnInit() {}
}
