import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert, AlertResponse, AlertService } from '~app/shared/services/alert/alert.service';

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
    const alertMessage: Alert<boolean> = { body: message, title, level: 'info', responses, blocking: true };
    return this._alertService.displayMessage(alertMessage);
  }
}
