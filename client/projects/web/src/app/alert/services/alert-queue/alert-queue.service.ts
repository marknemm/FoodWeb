import { Injectable } from '@angular/core';
import { EMPTY, Observable, ObservableInput, Subject } from 'rxjs';
import { AlertLevel, AlertMessage, RawAlertMessage } from '~web/alert/interfaces/alert-message';
import { RawAlertRefinerService } from '~web/alert/services/raw-alert-refiner/raw-alert-refiner.service';

/**
 * A FoodWeb alert queue that processes & maintains app-wide alert messages.
 */
@Injectable({
  providedIn: 'root'
})
export class AlertQueueService {

  private _alerts: AlertMessage[] = [];
  private _alertAdded = new Subject<AlertMessage>();
  private _alertForwarded = new Subject<AlertMessage>();

  constructor(
    private _rawAlertRefinerService: RawAlertRefinerService
  ) {
    this.add = this.add.bind(this);
  }

  /**
   * An observable that emits a FoodWeb alert whenever it is added.
   */
  get alertAdded(): Observable<AlertMessage> {
    return this._alertAdded.asObservable();
  }

  /**
   * An observable that emits a FoodWeb alert which was added with default processing enabled, and should be forwarded
   * to the default alert processor service immediately (not added to queue).
   */
  get alertForwarded(): Observable<AlertMessage> {
    return this._alertForwarded.asObservable();
  }

  /**
   * A readonly array of all of the queued FoodWeb alerts.
   */
  get alerts(): ReadonlyArray<AlertMessage> {
    return this._alerts;
  }

  /**
   * The length of the FoodWeb alert queue.
   */
  get length(): number {
    return this._alerts.length;
  }

  /**
   * Adds a given alert to the alert queue. May also immediately forward the alert message to a top-level default alert processor
   * if defaultProcessing is enabled.
   * @param rawAlertMessage The raw alert message that shall be refined and processed by the queue.
   * @param level The level to be assigned to the alert. Deaults to 'danger'.
   * @param defaultProcessing Whether or not this alert should go through default processing, meaning that it will be immediately
   * consumed from the alert queue and displayed as a top-level non-blocking alert message. Default is true.
   */
  add(rawAlertMessage: RawAlertMessage, level: AlertLevel = 'danger', defaultProcessing = true): ObservableInput<never> {
    const alertMessage: AlertMessage = this._rawAlertRefinerService.refineRawAlert(rawAlertMessage, level);
    this._processAlertMessage(alertMessage, defaultProcessing);
    return EMPTY;
  }

  /**
   * Processes a given newly created AlertMessage based off of the balue of a gien defaultProcessing flag.
   * @param alertMessage The alert message that is to be processed.
   * @param defaultProcessing Whether or not this alert should go through default processing, meaning that it will be immediately
   * consumed from the alert queue and displayed as a top-level non-blocking alert message.
   */
  private _processAlertMessage(alertMessage: AlertMessage, defaultProcessing: boolean): void {
    if (defaultProcessing) {
      this._alertForwarded.next(alertMessage);
    } else {
      this._alerts.push(alertMessage);
      this._alertAdded.next(alertMessage);
    }
  }

  /**
   * Deques a processed FoodWeb alert from the queue.
   * @return The dequed FoodWeb alert.
   */
  deque(): AlertMessage {
    return this._alerts.shift();
  }

  /**
   * Empties the alert queue.
   */
  empty(): void {
    this._alerts = [];
  }

  /**
   * Peeks at the next FoodWeb alert within the queue without dequeuing it.
   * @return The next FoodWeb alert.
   */
  peek(): AlertMessage {
    return this._alerts[0];
  }
}
