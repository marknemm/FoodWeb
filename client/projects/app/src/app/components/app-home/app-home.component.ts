import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppAlert, AppAlertService } from '~app/app-alert/services/app-alert/app-alert.service';
import { AppAuthenticationService } from '~app/app-session/services/app-authentication/app-authentication.service';

@Component({
  selector: 'foodweb-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.scss']
})
export class AppHomeComponent implements OnInit {


  constructor(
    private _activatedRoute: ActivatedRoute,
    private _alertService: AppAlertService,
    private _authService: AppAuthenticationService
  ) {}

  ngOnInit() {
    if (!!this._activatedRoute.snapshot.params['login']) {
      // Logout if directed to '/home/login' with an impersonationToken query param present.
      if (!!this._activatedRoute.snapshot.queryParams['impersonationToken']) {
        this._authService.logout();
      }
    }

    setTimeout(() => {
      const alert: AppAlert = {
        title: 'Test Alert Title',
        message: 'Test alert message...',
        level: 'info',
        blocking: true
      };
      this._alertService.displayAlert(alert).subscribe(() => {
        console.log('Alert Closed!');
      });
    }, 1000);
  }

}
