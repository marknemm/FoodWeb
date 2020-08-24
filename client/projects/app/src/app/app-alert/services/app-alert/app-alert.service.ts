import { Injectable, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from '@nativescript/angular';
import { Feedback } from 'nativescript-feedback';
import { from, Observable } from 'rxjs';
import { AppAlertDialogComponent } from '~app/app-alert/components/app-alert-dialog/app-alert-dialog.component';
import { AlertLevel, AppAlert, AppAlertConfig } from '~app/app-alert/interfaces/app-alert';
import { AlertProcessor } from '~web/alert/classes/alert-processor';
export * from '~app/app-alert/interfaces/app-alert';

@Injectable({
  providedIn: 'root'
})
export class AppAlertService extends AlertProcessor {

  defaultViewContainerRef: ViewContainerRef;

  constructor(
    private _feedback: Feedback,
    private _modalDialogService: ModalDialogService
  ) { super(); }

  /**
   * Displays a given simple message in either a non-blocking snackbar or blocking modal dialog.
   * @param message The message content to be displayed.
   * @param level The level of the message to display (determines theming of blocking dialog or non-blocking snackbar).
   * @param blocking Whether or not the message should be blocking (in a modal dialog). Defaults to false for non-blocking.
   */
  displaySimpleMessage(message: string, level: AlertLevel, blocking?: boolean): void {
    this.displayAlert({ message, level, blocking });
  }

  /**
   * Displays a given alert message in either a non-blocking snackbar or blocking modal dialog.
   * @param message The alert message that is to be displayed.
   * @param config The alert display configuration.
   * @return An observable that emits the selected alert action when the dialog closes. Emits null if no action was selected.
   */
  displayAlert<T>(alert: AppAlert<T>, config: AppAlertConfig = {}): Observable<T> {
    this._fillDefaultConfig(alert, config);

    return (alert.blocking)
      ? this._displayBlockingAlert(config)
      : this._displayNonBlockingAlert(config);
  }

  /**
   * Fills default options for a given app alert config based on a given app alert.
   * @param alert The alert that shall be used to fill default config options (internally modified).
   * @param config The config options that will have default values filled (internally modified).
   */
  private _fillDefaultConfig<T>(alert: AppAlert<T>, config: AppAlertConfig): void {
    alert.title = alert.title ? alert.title : '';
    alert.actions = alert.actions ? alert.actions : [];

    config.message = config.message ? config.message : alert.message;
    config.title = config.title ? config.title : alert.title;
    config.context = config.context ? config.context : alert;
    config.viewContainerRef = config.viewContainerRef ? config.viewContainerRef : this.defaultViewContainerRef;
  }

  /**
   * Display a blocking alert dialog.
   * @param config The app alert config that is to be supplied to the dialog.
   * @return An observable that emits the selected dialog action upon close. If no action was selected, then emits undefined.
   */
  private _displayBlockingAlert<T>(config: AppAlertConfig): Observable<T> {
    return from(
      this._modalDialogService.showModal(AppAlertDialogComponent, { context: config.context, viewContainerRef: config.viewContainerRef, fullscreen: false })
    );
  }

  /**
   * Display a non-blocking alert via a feedback element.
   * @param config The app alert config that is to be supplied to the feedback element.
   * @return An observable that emits (void) when the feedback closes.
   */
  private _displayNonBlockingAlert(config: AppAlertConfig): Observable<any> {
    let feedbackClosed: Promise<void>;

    switch (config.context.level) {
      case 'danger':  feedbackClosed = this._feedback.error(config);   break;
      case 'info':    feedbackClosed = this._feedback.info(config);    break;
      case 'success': feedbackClosed = this._feedback.success(config); break;
      case 'warn':    feedbackClosed = this._feedback.warning(config); break;
      default:        throw new Error(`Incorrect alert message level given: ${config.context.level}`);
    }

    return from(feedbackClosed);
  }
}
