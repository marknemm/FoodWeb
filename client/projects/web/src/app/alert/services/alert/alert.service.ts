import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertDialogComponent } from '~web/alert/components/alert-dialog/alert-dialog.component';
import { AlertSnackBarComponent } from '~web/alert/components/alert-snack-bar/alert-snack-bar.component';
import { Alert, AlertDisplayer } from '~web/alert/interfaces/alert';
export * from '~web/alert/interfaces/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService extends AlertDisplayer {

  constructor(
    protected _matDialog: MatDialog,
    protected _matSnackBar: MatSnackBar
  ) { super(); }

  displayAlert(alert: Alert): Observable<boolean> {
    return alert.blocking ?
      this._displayBlockingAlert(alert) :
      this._displayNonBlockingAlert(alert);
  }

  protected _displayBlockingAlert(alert: Alert): Observable<boolean> {
    const config: MatDialogConfig<Alert> = {};
    config.data = alert;
    config.role = this._deriveDialogRole(config, alert);
    config.panelClass = this._deriveAlertClass(alert);
    console.log(config.data);
    return this._matDialog.open(AlertDialogComponent, config).afterClosed();
  }

  protected _displayNonBlockingAlert(alert: Alert): Observable<boolean> {
    const config: MatSnackBarConfig<Alert> = {};
    config.data = alert;
    config.panelClass = this._deriveAlertClass(alert);
    config.announcementMessage = this._deriveSnackBarAnnouncement(config, alert);
    return this._matSnackBar.openFromComponent(AlertSnackBarComponent, config).afterDismissed().pipe(
      map((dismiss: MatSnackBarDismiss) => dismiss.dismissedByAction)
    );
  }

  protected _deriveDialogRole(config: MatDialogConfig, alert: Alert): 'dialog' | 'alertdialog' {
    if (config.role) {
      return config.role;
    }
    return (['warn', 'danger'].indexOf(alert.level) >= 0) ? 'alertdialog' : 'dialog';
  }

  protected _deriveAlertClass(alert: Alert): string[] {
    let cssClassList: string[] = [];
    if (typeof alert.cssClass === 'string') {
      cssClassList = alert.cssClass.split(' ');
    } else if (alert.cssClass != null) {
      cssClassList = alert.cssClass;
    }
    return cssClassList.concat(`mat-alert-${alert.level}`);
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
