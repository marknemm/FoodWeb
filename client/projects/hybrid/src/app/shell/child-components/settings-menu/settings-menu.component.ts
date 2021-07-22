import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { gift, location, person, power, shareSocial } from 'ionicons/icons';
import { AuthenticationService } from '~hybrid/session/services/authentication/authentication.service';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { PopoverService } from '~hybrid/shared/services/popover/popover.service';

@Component({
  selector: 'foodweb-hybrid-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss']
})
export class SettingsMenuComponent implements OnInit {

  @HostBinding()
  class = 'foodweb-settings-menu';

  @Input()
  isMenu = false;

  gift = gift;
  location = location;
  person = person;
  power = power;
  shareSocial = shareSocial;

  constructor(
    public authService: AuthenticationService,
    public sessionService: SessionService,
    private _popoverService: PopoverService,
  ) {}

  ngOnInit() {}

  showMenu(event: Event): void {
    this._popoverService.showMenu(SettingsMenuComponent, event);
  }
}
