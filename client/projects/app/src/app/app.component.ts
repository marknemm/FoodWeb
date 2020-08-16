import { Component } from '@angular/core';
import { AppDefaultAlertProcessorService } from '~app/app-alert/services/app-default-alert-processor/app-default-alert-processor.service';
import { AppAuthenticationService } from '~app/app-session/services/app-authentication/app-authentication.service';
import { AppLeftNavService } from '~app/app-shell/services/app-left-nav/app-left-nav.service';
import { JSONDateReviver } from '~shared';

@Component({
  selector: 'foodweb-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public leftNavService: AppLeftNavService,
    authService: AppAuthenticationService,
    jsonDateReviver: JSONDateReviver,
    defaultAlertProcessorService: AppDefaultAlertProcessorService,
  ) {
    jsonDateReviver.initJSONDateReviver();
    defaultAlertProcessorService.monitorAlerts();
    authService.refreshSessionStatus().subscribe();
  }
}
