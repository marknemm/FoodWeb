import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { DeviceInfoService } from '../../../mobile/services/device-info/device-info.service';
import { SessionService } from '../../../session/services/session/session.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler/error-handler.service';
import { AppData } from '../../../../../../shared/src/interfaces/app-data/app-data';
import { AppDataSaveRequest } from '../../../../../../shared/src/interfaces/app-data/app-data-save-request';
import { Account } from '../../../../../../shared/src/interfaces/account/account';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  readonly url = `${environment.server}/app-data`

  private _pushNotificationClient: PhonegapPluginPush.PushNotification;
  private _pushRegistrationId: string;

  constructor(
    private _deviceInfoService: DeviceInfoService,
    private _sessionService: SessionService,
    private _httpClient: HttpClient,
    private _errHandlerService: ErrorHandlerService
  ) {}

  get pushRegistrationId(): string {
    return this._pushRegistrationId;
  }

  init(): void {
    // Only init if this is a mobile app.
    if (this._deviceInfoService.isMobileApp) {
      this._sessionService.login$.subscribe(this._register.bind(this));
      this._sessionService.logout$.subscribe(this._unregister.bind(this));
      if (this._sessionService.loggedIn) { this._register(); }
    }
  }

  private _register(): void {
    this._pushNotificationClient = PushNotification.init({
      android: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      },
      ios: {
        alert: "true",
        badge: true,
        sound: 'false'
      },
      windows: {}
    });
    this._listenForRegistrationResponse();
  }

  private _listenForRegistrationResponse(): void {
    this._pushNotificationClient.on('registration', (response: PhonegapPluginPush.RegistrationEventResponse) => {
      this._pushRegistrationId = response.registrationId;
      const appData: AppData = this._deviceInfoService.genAppData();
      appData.pushRegistrationId = this._pushRegistrationId;
      const saveReq: AppDataSaveRequest = { appData };
      this._httpClient.post<void>(this.url, saveReq).pipe(
        catchError((err: HttpErrorResponse) => this._errHandlerService.handleError(err))
      ).subscribe();
    });
  }

  private _unregister(account: Account): void {
    if (this._pushNotificationClient) {
      this._pushNotificationClient.unregister(
        () => this._onUnregistrationResponse(account),
        () => console.error('Unregister push notification failed.')
      );
      this._pushNotificationClient = null;
    }
  }

  private _onUnregistrationResponse(account: Account): void {
    this._pushRegistrationId = null;
    const deviceUuid: string = this._deviceInfoService.uuid;
    this._httpClient.delete(`${this.url}/${account.id}/${deviceUuid}`).pipe(
      catchError((err: HttpErrorResponse) => this._errHandlerService.handleError(err))
    ).subscribe();
  }
}
