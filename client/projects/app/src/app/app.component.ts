import { Component, ViewContainerRef } from '@angular/core';
import { AppAlertService } from '~app/app-alert/services/app-alert/app-alert.service';
import { AppLeftNavService } from '~app/app-shell/services/app-left-nav/app-left-nav.service';
import { JSONDateReviver } from '~shared';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';

@Component({
  selector: 'foodweb-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public leftNavService: AppLeftNavService,
    alertService: AppAlertService,
    alertQueueService: AlertQueueService,
    jsonDateReviver: JSONDateReviver,
    viewContainerRef: ViewContainerRef,
  ) {
    jsonDateReviver.initJSONDateReviver();
    alertService.defaultViewContainerRef = viewContainerRef;
    alertQueueService.registerDefaultAlertProcessor(alertService);
  }
}
