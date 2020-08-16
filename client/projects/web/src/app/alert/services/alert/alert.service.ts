import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertDialogComponent } from '~web/alert/components/alert-dialog/alert-dialog.component';
import { AlertSnackBarComponent } from '~web/alert/components/alert-snack-bar/alert-snack-bar.component';
import { Alert, AlertAction, AlertBody, AlertConfig, AlertLevel } from '~web/alert/interfaces/alert';
export * from '~web/alert/interfaces/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    protected _matDialog: MatDialog,
    protected _matSnackBar: MatSnackBar
  ) {}

  /**
   * Displays a given simple message in either a non-blocking snackbar or blocking modal dialog.
   * @param body The body content of the simple message.
   * @param level The level of the message to display (determines theming of blocking dialog or non-blocking snackbar).
   * @param blocking Whether or not the message should be blocking (in a modal dialog). Defaults to false for non-blocking.
   */
  displaySimpleMessage(body: AlertBody, level: AlertLevel, blocking = false): void {
    this.displayMessage({ body, level, blocking});
  }

  /**
   * Displays a given alert message in either a non-blocking snackbar or blocking modal dialog.
   * @param message The alert message that is to be displayed.
   * @param config The alert display configuration.
   * @return An observable that emits the selected alert action when the dialog closes. Emits null if no action was selected.
   */
  displayMessage<T>(message: Alert<T>, config: AlertConfig<Alert<T>> = {}): Observable<T> {
    // First set any missing Alert Response data.
    this._preprocessAlertActions(message);
    return message.blocking ?
      this._displayBlockingMessage<T>(message, config) :
      this._displayNonBlockingMessage<T>(message, config);
  }

  protected _preprocessAlertActions(message: Alert): void {
    if (!message.actions) {
      message.actions = [];
    }

    for (const response of message.actions) {
      response.buttonType = (response.buttonType ? response.buttonType : 'mat-button');
      response.text = (response.text ? response.text : response.value.toString());
      response.color = (response.color ? response.color : `alert-${message.level}`);
    }

    message.primaryAction = message.actions.filter(
      (response: AlertAction) => response.cdkFocusPrimary
    )[0];
    if (!message.primaryAction) {
      message.primaryAction = message.actions[0];
    }
  }

  protected _displayBlockingMessage<T>(message: Alert<T>, config: MatDialogConfig<Alert<T>>): Observable<T> {
    config.data = message;
    config.role = this._deriveDialogRole(config, message);
    config.panelClass = this._deriveAlertClass(config, message);
    return this._matDialog.open(AlertDialogComponent, config).afterClosed();
  }

  protected _displayNonBlockingMessage<T>(message: Alert<T>, config: MatSnackBarConfig<Alert<T>>): Observable<T> {
    config.data = message;
    config.panelClass = this._deriveAlertClass(config, message);
    config.announcementMessage = this._deriveSnackBarAnnouncement(config, message);
    return this._matSnackBar.openFromComponent(AlertSnackBarComponent, config).afterDismissed().pipe(
      map((dismiss: MatSnackBarDismiss) =>
        (dismiss.dismissedByAction ? message.primaryAction?.value : null)
      )
    );
  }

  protected _deriveDialogRole(config: MatDialogConfig, message: Alert): 'dialog' | 'alertdialog' {
    if (config.role) {
      return config.role;
    }
    return (['warn', 'danger'].indexOf(message.level) >= 0) ? 'alertdialog' : 'dialog';
  }

  protected _deriveAlertClass(config: AlertConfig, message: Alert): string[] {
    let dialogClass: string[] = [];
    if (typeof config.panelClass === 'string') {
      dialogClass = config.panelClass.split(' ');
    } else if (config.panelClass != null) {
      dialogClass = config.panelClass;
    }
    return dialogClass.concat(`mat-alert-${message.level}`);
  }

  protected _deriveSnackBarAnnouncement(config: MatSnackBarConfig, message: Alert): string {
    if (config.announcementMessage) {
      return config.announcementMessage;
    }
    if (typeof message.body === 'string') {
      return message.body;
    }
    if (message.title) {
      return message.title;
    }
    return `Snack bar has an alert message of type: ${message.level}.`;
  }
}
