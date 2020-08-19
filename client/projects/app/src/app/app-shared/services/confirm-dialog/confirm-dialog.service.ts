import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppAlert, AlertResponse, AppAlertService } from '~app/app-shared/services/app-alert/app-alert.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  private readonly _defaultResponses: AlertResponse<boolean>[] = [
    { text: 'Cancel', value: false, color: 'warn' },
    { text: 'Confirm', value: true, cdkFocusPrimary: true }
  ];

  constructor(
    private _alertService: AppAlertService
  ) {}

  displayConfirmDialog(message: string, title?: string, responses: AlertResponse<any>[] = this._defaultResponses): Observable<any> {
    const alert: AppAlert<boolean> = { message, title, level: 'info', responses, blocking: true };
    return this._alertService.displayMessage(alert);
  }
}
