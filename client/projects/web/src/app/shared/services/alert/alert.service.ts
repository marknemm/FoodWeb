import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertDialogComponent } from '~web/shared/components/alert-dialog/alert-dialog.component';
import { AlertSnackBarComponent } from '~web/shared/components/alert-snack-bar/alert-snack-bar.component';
import { AlertConfig, AlertLevel, AlertMessage, AlertResponse } from '~web/shared/services/alert/alert-message';
import { AlertResponseService } from '~web/shared/services/alert/alert-response.service';
export * from './alert-message';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _alertResponseService: AlertResponseService
  ) {}

  displaySimpleMessage(messageBody: string, level: AlertLevel, blocking?: boolean): void {
    this.displayMessage({ body: messageBody, level, blocking});
  }

  displayMessage<T>(message: AlertMessage<T>, config: AlertConfig<AlertMessage<T>> = {}): Observable<T> {
    // First set any missing Alert Response data.
    this._alertResponseService.preprocessResponses(message);
    return message.blocking ?
      this._displayBlockingMessage<T>(message, config) :
      this._displayNonBlockingMessage<T>(message, config);
  }

  private _displayBlockingMessage<T>(message: AlertMessage<T>, config: MatDialogConfig<AlertMessage<T>>): Observable<T> {
    config.data = message;
    config.role = this._deriveDialogRole(config, message);
    config.panelClass = this._deriveAlertClass(config, message);
    return this._matDialog.open(AlertDialogComponent, config).afterClosed();
  }

  private _displayNonBlockingMessage<T>(message: AlertMessage<T>, config: MatSnackBarConfig<AlertMessage<T>>): Observable<T> {
    config.data = message;
    config.panelClass = this._deriveAlertClass(config, message);
    config.announcementMessage = this._deriveSnackBarAnnouncement(config, message);
    return this._matSnackBar.openFromComponent(AlertSnackBarComponent, config).afterDismissed().pipe(
      map((dismiss: MatSnackBarDismiss) =>
        (dismiss.dismissedByAction ? this._getActionValue(message) : null)
      )
    );
  }

  private _deriveDialogRole(config: MatDialogConfig, message: AlertMessage): 'dialog' | 'alertdialog' {
    if (config.role) {
      return config.role;
    }
    return (['warn', 'danger'].indexOf(message.level) >= 0) ? 'alertdialog' : 'dialog';
  }

  private _deriveAlertClass(config: AlertConfig, message: AlertMessage): string[] {
    let dialogClass: string[] = [];
    if (typeof config.panelClass === 'string') {
      dialogClass = config.panelClass.split(' ');
    } else if (config.panelClass != null) {
      dialogClass = config.panelClass;
    }
    return dialogClass.concat(`mat-alert-${message.level}`);
  }

  private _deriveSnackBarAnnouncement(config: MatSnackBarConfig, message: AlertMessage): string {
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

  private _getActionValue<T>(message: AlertMessage): T {
    const primaryResponse: AlertResponse<T> = this._alertResponseService.getPrimaryResponse(message);
    const actionValue: T = (primaryResponse ? primaryResponse.value : null);
    return actionValue;
  }
}
