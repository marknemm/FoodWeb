import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppAlert, AppAlertAction, AppAlertConfig, AppAlertService } from '~app/app-shared/services/app-alert/app-alert.service';

@Injectable({
  providedIn: 'root'
})
export class AppConfirmDialogService {

  private readonly _defaultActions: AppAlertAction<boolean>[] = [
    { text: 'Cancel', value: false, color: 'red' },
    { text: 'Confirm', value: true, focusPrimary: true }
  ];

  constructor(
    private _alertService: AppAlertService
  ) {}

  displayConfirmDialog(message: string, title?: string, actions: AppAlertAction<any>[] = this._defaultActions): Observable<any> {
    const alert: AppAlert<boolean> = { message, title, level: 'info', actions, blocking: true };
    const config: AppAlertConfig = { cancelable: false };
    return this._alertService.displayAlert(alert, config);
  }
}
