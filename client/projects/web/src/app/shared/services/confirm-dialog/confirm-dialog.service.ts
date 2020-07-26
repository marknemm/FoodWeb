import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AlertMessage, AlertResponse } from '~web/shared/services/alert/alert-message';
import { AlertService } from '~web/shared/services/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  private readonly _defaultResponses: AlertResponse<boolean>[] = [
    { text: 'Cancel', value: false, color: 'warn' },
    { text: 'Confirm', value: true, cdkFocusPrimary: true }
  ];

  constructor(
    private _alertService: AlertService
  ) {}

  displayConfirmDialog(message: string, title?: string, responses: AlertResponse<any>[] = this._defaultResponses): Observable<any> {
    const alertMessage: AlertMessage<boolean> = { body: message, title, level: 'info', responses, blocking: true };
    const config: MatDialogConfig<AlertMessage<boolean>> = { disableClose: true };
    return this._alertService.displayMessage(alertMessage, config);
  }
}
