import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Device } from '@ionic-native/device/ngx';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '~app-env/environment';
import { ErrorHandlerService } from '~web/shared';
import { AppData, AppDataSaveRequest } from '~shared';

@Injectable({
  providedIn: 'root'
})
export class AppDataService extends Device {

  readonly url = `${environment.server}/app-data`;

  private _cordova: string;
  private _available: boolean;
  private _model: string;
  private _uuid: string;
  private _platform = 'Browser';
  private _version: string;
  private _manufacturer: string;
  private _isVirtual: boolean;
  private _serial: string;
  private _isMobileApp = false;
  private _pushRegistrationId: string;
  private _accountId: number;

  constructor(
    private _httpClient: HttpClient,
    private _errHandlerService: ErrorHandlerService
  ) {
    super();
    document.addEventListener('deviceready', () => {
      Object.keys(device).forEach((deviceKey: string) => {
        this[`_${deviceKey}`] = device[deviceKey];
      });
      this._isMobileApp = (this.platform && this.platform !== 'Browser');
    }, false);
  }

  get cordova(): string {
    return this._cordova;
  }

  get available(): boolean {
    return this._available;
  }

  get model(): string {
    return this._model;
  }

  get uuid(): string {
    return this._uuid;
  }

  get version(): string {
    return this._version;
  }

  get manufacturer(): string {
    return this._manufacturer;
  }

  get isVirtual(): boolean {
    return this._isVirtual;
  }

  get serial(): string {
    return this._serial;
  }

  get isMobileApp(): boolean {
    return this._isMobileApp;
  }

  get isAndroid(): boolean {
    return this._platform === 'Android'
  }

  get isIos(): boolean {
    return this._platform === 'iOS';
  }

  get isBrowser(): boolean {
    return this._platform === 'Browser';
  }

  get platform(): string {
    return this._platform;
  }

  get pushRegistrationId(): string {
    return this._pushRegistrationId;
  }

  get accountId(): number {
    return this._accountId;
  }

  saveAppData(appDataMerge: Partial<AppData>): Observable<AppData> {
    const appData: AppData = this._mergeAppData(appDataMerge);
    const saveReq: AppDataSaveRequest = { appData };
    return this._httpClient.post<AppData>(this.url, saveReq, { withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errHandlerService.handleError(err)),
      map((appData: AppData) => {
        this._accountId = appData.accountId;
        return appData;
      })
    );
  }

  private _mergeAppData(appDataMerge: Partial<AppData>): AppData {
    if (appDataMerge.pushRegistrationId) {
      this._pushRegistrationId = appDataMerge.pushRegistrationId;
    }
    return this.genAppData();
  }

  genAppData(): AppData {
    return {
      deviceUuid: this.uuid,
      devicePlatform: this.platform,
      deviceModel: this.model,
      deviceVersion: this.version,
      deviceManufacturer: this.manufacturer,
      deviceSerial: this.serial,
      deviceIsVirtual: this.isVirtual,
      pushRegistrationId: this.pushRegistrationId,
      accountId: this.accountId
    };
  }

  deleteAppData(): Observable<void> {
    const accountId: number = this.accountId;
    this._accountId = null;
    this._pushRegistrationId = null;
    return this._httpClient.delete(`${this.url}/${accountId}/${this.uuid}`, { withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errHandlerService.handleError(err))
    );
  }
}
