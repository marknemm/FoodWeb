import { Component, OnInit } from '@angular/core';
import { AppAuthenticationService } from '~app/app-session/services/app-authentication/app-authentication.service';
import { AppSessionService } from '~app/app-session/services/app-session/app-session.service';
import { AppLeftNavService } from '~app/app-shell/services/app-left-nav/app-left-nav.service';

@Component({
  selector: 'foodweb-app-left-nav-items',
  templateUrl: './app-left-nav-items.component.html',
  styleUrls: ['./app-left-nav-items.component.scss']
})
export class AppLeftNavItemsComponent implements OnInit {

  constructor(
    public authenticationServce: AppAuthenticationService,
    public leftNavService: AppLeftNavService,
    public sessionService: AppSessionService,
  ) {}

  ngOnInit() {}

}
