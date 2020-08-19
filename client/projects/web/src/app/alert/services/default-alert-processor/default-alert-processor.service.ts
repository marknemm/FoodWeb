import { Injectable } from '@angular/core';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';
import { AlertService, SimpleAlert } from '~web/alert/services/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class DefaultAlertProcessorService {

  constructor(
    private _alertService: AlertService,
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
