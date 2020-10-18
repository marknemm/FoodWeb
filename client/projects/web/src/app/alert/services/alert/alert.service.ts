import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertProcessor } from '~web/alert/classes/alert-processor';
import { AlertDialogComponent } from '~web/alert/components/alert-dialog/alert-dialog.component';
import { AlertSnackBarComponent } from '~web/alert/components/alert-snack-bar/alert-snack-bar.component';
import { Alert, AlertAction, AlertConfig, AlertLevel } from '~web/alert/interfaces/alert';
export * from '~web/alert/interfaces/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService extends AlertProcessor {

  constructor(
    protected _matDialog: MatDialog,
    protected _matSnackBar: MatSnackBar
  ) { super(); }

  /**
   * Displays a given simple message in either a non-blocking snackbar or blocking modal dialog.
   * @param message The message content that is to be displayed.
   * @param level The level of the message to display (determines theming of blocking dialog or non-blocking snackbar).
   * @param blocking Whether or not the message should be blocking (in a modal dialog). Defaults to false for non-blocking.
   */
  displaySimpleMessage(message: string, level: AlertLevel, blocking = false): void {
    this.displayAlert({ message, level, blocking});
  }

  /**
   * Displays a given alert message in either a non-blocking snackbar or blocking modal dialog.
   * @param alert The alert message that is to be displayed.
   * @param config The alert display configuration.
   * @return An observable that emits the selected alert action when the dialog closes. Emits null if no action was selected.
   */
  displayAlert<T>(alert: Alert<T>, config: AlertConfig<Alert<T>> = {}): Observable<T> {
    // First set any missing Alert Response data.
    this._preprocessAlertActions(alert);
    return alert.blocking ?
      this._displayBlockingAlert<T>(alert, config) :
      this._displayNonBlockingAlert<T>(alert, config);
  }

  protected _preprocessAlertActions(alert: Alert): void {
    if (!alert.actions) {
      alert.actions = [];
    }

    for (const response of alert.actions) {
      response.buttonType = (response.buttonType ? response.buttonType : 'mat-button');
      response.text = (response.text ? response.text : response.value.toString());
      response.color = (response.color ? response.color : `alert-${alert.level}`);
    }

    alert.primaryAction = alert.actions.filter(
      (response: AlertAction) => response.focusPrimary
    )[0];
    if (!alert.primaryAction) {
      alert.primaryAction = alert.actions[0];
    }
  }

  protected _displayBlockingAlert<T>(alert: Alert<T>, config: MatDialogConfig<Alert<T>>): Observable<T> {
    config.data = alert;
    config.role = this._deriveDialogRole(config, alert);
    config.panelClass = this._deriveAlertClass(config, alert);
    return this._matDialog.open(AlertDialogComponent, config).afterClosed();
  }

  protected _displayNonBlockingAlert<T>(alert: Alert<T>, config: MatSnackBarConfig<Alert<T>>): Observable<T> {
    config.data = alert;
    config.panelClass = this._deriveAlertClass(config, alert);
    config.announcementMessage = this._deriveSnackBarAnnouncement(config, alert);
    return this._matSnackBar.openFromComponent(AlertSnackBarComponent, config).afterDismissed().pipe(
      map((dismiss: MatSnackBarDismiss) =>
        (dismiss.dismissedByAction ? alert.primaryAction?.value : null)
      )
    );
  }

  protected _deriveDialogRole(config: MatDialogConfig, alert: Alert): 'dialog' | 'alertdialog' {
    if (config.role) {
      return config.role;
    }
    return (['warn', 'danger'].indexOf(alert.level) >= 0) ? 'alertdialog' : 'dialog';
  }

  protected _deriveAlertClass(config: AlertConfig, alert: Alert): string[] {
    let dialogClass: string[] = [];
    if (typeof config.panelClass === 'string') {
      dialogClass = config.panelClass.split(' ');
    } else if (config.panelClass != null) {
      dialogClass = config.panelClass;
    }
    return dialogClass.concat(`mat-alert-${alert.level}`);
  }

  protected _deriveSnackBarAnnouncement(config: MatSnackBarConfig, alert: Alert): string {
    if (config.announcementMessage) {
      return config.announcementMessage;
    }
    if (typeof alert.message === 'string') {
      return alert.message;
    }
    if (alert.title) {
      return alert.title;
    }
    return `Snack bar has an alert message of type: ${alert.level}.`;
  }
}
