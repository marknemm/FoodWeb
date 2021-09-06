import { Component, HostBinding, Input, OnInit } from '@angular/core';
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

  constructor(
    public authService: AuthenticationService,
    public sessionService: SessionService,
    private _popoverService: PopoverService,
  ) {}

  ngOnInit() {}

  present(event: Event): void {
    this._popoverService.present(SettingsMenuComponent, event);
  }

  dismiss(): void {
    this._popoverService.dismiss(SettingsMenuComponent);
  }
}
