import { Component, OnInit } from '@angular/core';
import { faGifts } from '@fortawesome/free-solid-svg-icons';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss']
})
export class SettingsMenuComponent implements OnInit {

  faGifts = faGifts;

  constructor(
    public sessionService: SessionService
  ) {}

  ngOnInit() {}
}
