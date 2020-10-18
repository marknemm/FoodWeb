import { Injectable } from '@angular/core';
import { EMPTY, Observable, ObservableInput, Subject } from 'rxjs';
import { AlertProcessor } from '~web/alert/classes/alert-processor';
import { AlertBase, AlertLevel, RawAlertMessage } from '~web/alert/interfaces/alert-base';
import { RawAlertRefinerService } from '~web/alert/services/raw-alert-refiner/raw-alert-refiner.service';

/**
 * A FoodWeb alert queue that processes & maintains app-wide alert messages.
 */
@Injectable({
  providedIn: 'root'
})
export class AlertQueueService {

  private _alerts: AlertBase[] = [];
  private _alertAdded = new Subject<AlertBase>();
  private _defaultAlertProcessor: AlertProcessor;

  constructor(
    private _rawAlertRefinerService: RawAlertRefinerService
  ) {
    this.add = this.add.bind(this);
  }

  /**
   * An observable that emits a FoodWeb alert whenever it is added.
   */
  get alertAdded(): Observable<AlertBase> {
    return this._alertAdded.asObservable();
  }

  /**
   * A readonly array of all of the queued FoodWeb alerts.
   */
  get alerts(): ReadonlyArray<AlertBase> {
    return this._alerts;
  }

  /**
   * The length of the FoodWeb alert queue.
   */
  get length(): number {
    return this._alerts.length;
  }

  /**
   * Adds a given alert to the alert queue for later processing.
   * @param rawAlertMessage The raw alert message that shall be refined and processed by the queue.
   * @param level The level to be assigned to the alert. Deaults to 'danger'.
   */
  add(rawAlertMessage: RawAlertMessage, level: AlertLevel = 'danger'): ObservableInput<never> {
    const alert: AlertBase = this._rawAlertRefinerService.refineRawAlert(rawAlertMessage, level);
    this._alerts.push(alert);
    this._alertAdded.next(alert);
    return EMPTY;
  }

  /**
   * Deques a processed FoodWeb alert from the queue.
   * @return The dequed FoodWeb alert.
   */
  deque(): AlertBase {
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
  peek(): AlertBase {
    return this._alerts[0];
  }

  /**
   * Processes a given alert immediately via either the registered default alert processor.
   * @param alert The alert that shall be processed.
   * @param config The optional configuration for the alert.
   * @return An observable that emits the resulting value from the alert once it is closed.
   */
  processImmediately<T = any>(alert: AlertBase, config?: any): Observable<T>;

  /**
   * Processes a given raw alert message immediately via either the registered default alert processor.
   * @param rawAlertMessage The raw alert message that shall be processed.
   * @param level The optional level for the alert message. Defaults to `danger`.
   * @param config The optional configuration for the alert.
   * @return An observable that emits the resulting value from the alert once it is closed.
   */
  processImmediately<T = any>(rawAlertMessage: RawAlertMessage, level?: AlertLevel, config?: any): Observable<T>;

  processImmediately<T = any>(
    alert: AlertBase | RawAlertMessage,
    levelOrConfig?: any,
    config?: any,
  ): Observable<T> {
    alert = this._rawAlertRefinerService.refineRawAlert(alert, levelOrConfig);

    if (!config && typeof levelOrConfig !== 'string') {
      config = levelOrConfig;
    }

    return this._defaultAlertProcessor.displayAlert(<AlertBase>alert, config);
  }

  /**
   * Registers a default (top-level) alert processor which monitors alerts that have been processed by the AlertQueueService
   * that have been marked for default processing. Whenever an alert is added with default processing enabled, it will be
   * immediately consumed and displayed via an associated top-level non-blocking alert UI element.
   * @param alertProcessor The default alert processor that is to be registered.
   */
  registerDefaultAlertProcessor(alertProcessor: AlertProcessor): void {
    this._defaultAlertProcessor = alertProcessor;
  }
}
