import { Component } from '@angular/core';
import { JSONDateReviver } from '~shared';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';
import { AlertService } from '~web/alert/services/alert/alert.service';
import { IeAlertService } from '~web/alert/services/ie-alert/ie-alert.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { IconService } from '~web/shared/services/icon/icon.service';

@Component({
  selector: 'foodweb-admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    alertQueueService: AlertQueueService,
    alertService: AlertService,
    authService: AuthenticationService,
    iconService: IconService,
    ieAlert: IeAlertService,
    jsonDateReviver: JSONDateReviver,
  ) {
    iconService.init();
    ieAlert.showIEWarning();
    jsonDateReviver.initJSONDateReviver();
    alertQueueService.registerDefaultAlertProcessor(alertService);
    authService.refreshSessionStatus().subscribe();
  }
}
