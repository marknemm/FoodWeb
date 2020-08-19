import { Injectable } from '@angular/core';
import { SimpleAlert, AppAlertService } from '~app/app-alert/services/app-alert/app-alert.service';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';

@Injectable({
  providedIn: 'root'
})
export class AppDefaultAlertProcessorService {

  constructor(
    private _alertService: AppAlertService,
    private _alertQueueService: AlertQueueService
  ) {}

  /**
   * Monitors error messages that have been processed by the AlertQueueService which have been marked for default processing.
   * Whenever an error message is added with default processing enabled, it will be immediately consumed and displayed via
   * a top-level non-blocking snackbar alert.
   */
  monitorAlerts(): void {
    this._alertQueueService.alertForwarded.subscribe((alert: SimpleAlert) =>
      this._alertService.displayAlert(alert)
    );
  }
}
