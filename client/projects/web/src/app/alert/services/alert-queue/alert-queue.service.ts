import { Injectable } from '@angular/core';
import { EMPTY, Observable, ObservableInput, Subject } from 'rxjs';
import { AlertLevel, RawAlertMessage, SimpleAlert } from '~web/alert/interfaces/simple-alert';
import { RawAlertRefinerService } from '~web/alert/services/raw-alert-refiner/raw-alert-refiner.service';

/**
 * A FoodWeb alert queue that processes & maintains app-wide alert messages.
 */
@Injectable({
  providedIn: 'root'
})
export class AlertQueueService {

  private _alerts: SimpleAlert[] = [];
  private _alertAdded = new Subject<SimpleAlert>();
  private _alertForwarded = new Subject<SimpleAlert>();

  constructor(
    private _rawAlertRefinerService: RawAlertRefinerService
  ) {
    this.add = this.add.bind(this);
  }

  /**
   * An observable that emits a FoodWeb alert whenever it is added.
   */
  get alertAdded(): Observable<SimpleAlert> {
    return this._alertAdded.asObservable();
  }

  /**
   * An observable that emits a FoodWeb alert which was added with default processing enabled, and should be forwarded
   * to the default alert processor service immediately (not added to queue).
   */
  get alertForwarded(): Observable<SimpleAlert> {
    return this._alertForwarded.asObservable();
  }

  /**
   * A readonly array of all of the queued FoodWeb alerts.
   */
  get alerts(): ReadonlyArray<SimpleAlert> {
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
    const simpleAlert: SimpleAlert = this._rawAlertRefinerService.refineRawAlert(rawAlertMessage, level);
    this._processSimpleAlert(simpleAlert, defaultProcessing);
    return EMPTY;
  }

  /**
   * Processes a given newly created SimpleAlert based off of the balue of a gien defaultProcessing flag.
   * @param SimpleAlert The alert message that is to be processed.
   * @param defaultProcessing Whether or not this alert should go through default processing, meaning that it will be immediately
   * consumed from the alert queue and displayed as a top-level non-blocking alert message.
   */
  private _processSimpleAlert(simpleAlert: SimpleAlert, defaultProcessing: boolean): void {
    if (defaultProcessing) {
      this._alertForwarded.next(simpleAlert);
    } else {
      this._alerts.push(simpleAlert);
      this._alertAdded.next(simpleAlert);
    }
  }

  /**
   * Deques a processed FoodWeb alert from the queue.
   * @return The dequed FoodWeb alert.
   */
  deque(): SimpleAlert {
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
  peek(): SimpleAlert {
    return this._alerts[0];
  }
}
