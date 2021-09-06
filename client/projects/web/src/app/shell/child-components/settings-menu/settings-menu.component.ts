import { Component, HostBinding } from '@angular/core';
import { faGifts } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss']
})
export class SettingsMenuComponent {

  @HostBinding()
  class = 'foodweb-settings-menu';

  faGifts = faGifts;

  constructor(
    public authService: AuthenticationService,
    public sessionService: SessionService
  ) {}
}
