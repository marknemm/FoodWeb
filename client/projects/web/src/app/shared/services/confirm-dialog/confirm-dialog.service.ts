import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AlertAction, Alert, AlertService } from '~web/alert/services/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  private readonly _defaultResponses: AlertAction<boolean>[] = [
    { text: 'Cancel', value: false, color: 'warn' },
    { text: 'Confirm', value: true, cdkFocusPrimary: true }
  ];

  constructor(
    private _alertService: AlertService
  ) {}

  displayConfirmDialog(message: string, title?: string, actions: AlertAction<any>[] = this._defaultResponses): Observable<any> {
    const alert: Alert<boolean> = { message, title, level: 'info', actions, blocking: true };
    const config: MatDialogConfig<Alert<boolean>> = { disableClose: true };
    return this._alertService.displayAlert(alert, config);
  }
}
