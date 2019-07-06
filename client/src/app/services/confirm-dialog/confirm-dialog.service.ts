import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AlertService } from './../alert/alert.service';
import { AlertResponse, AlertMessage } from './../alert/alert-message';

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
