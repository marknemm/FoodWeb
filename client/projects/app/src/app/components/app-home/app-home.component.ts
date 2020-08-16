import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppAuthenticationService } from '~app/app-session/services/app-authentication/app-authentication.service';
import { AppSessionService } from '~app/app-session/services/app-session/app-session.service';

@Component({
  selector: 'foodweb-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.scss']
})
export class AppHomeComponent implements OnInit {


  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AppAuthenticationService,
    private _sessionService: AppSessionService
  ) {}

  ngOnInit() {
    if (!!this._activatedRoute.snapshot.params['login']) {
      // Logout if directed to '/home/login' with an impersonationToken query param present.
      if (!!this._activatedRoute.snapshot.queryParams['impersonationToken']) {
        this._authService.logout();
      }
    }
  }

}
