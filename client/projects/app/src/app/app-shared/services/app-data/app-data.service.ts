import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Device } from '@ionic-native/device/ngx';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '~app/environment';
import { ErrorHandlerService } from '~web/error-handler/error-handler.service';
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

  /**
   * Whether or not the device app data is currently available.
   */
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

  /**
   * Whether or not the platform is that of a mobile device: 'Android' or 'iOS'.
   */
  get isMobileApp(): boolean {
    return this._isMobileApp;
  }

  /**
   * Whether or not the device platform is 'Android'.
   */
  get isAndroid(): boolean {
    return this.platform === 'Android'
  }

  /**
   * Whether or not the device platform is 'iOS'.
   */
  get isIos(): boolean {
    return this.platform === 'iOS';
  }

  /**
   * Whether or not device platform is 'Browser'.
   */
  get isBrowser(): boolean {
    return this.platform === 'Browser';
  }

  get platform(): string {
    return this._platform;
  }

  /**
   * The push notification client registration ID for the mobile device.
   */
  get pushRegistrationId(): string {
    return this._pushRegistrationId;
  }

  /**
   * The ID of the user Account associated with the app data.
   */
  get accountId(): number {
    return this._accountId;
  }

  /**
   * Saves app data on the server, and associates it with the user's account.
   * @param appDataMerge The app data that is to be merged with the contained app data in this class before saving.
   * NOTE: only mutable app data fields may be merged in (pushRegistrationId).
   * @return An observable that resolves to the saved app data.
   */
  saveAppData(appDataMerge: Partial<AppData>): Observable<AppData> {
    const appData: AppData = this._mergeAppData(appDataMerge);
    const saveReq: AppDataSaveRequest = { appData };
    return this._httpClient.post<AppData>(this.url, saveReq, { withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errHandlerService.handleError(err)),
      map((appData: AppData) => {
        this._accountId = appData.accountId;
        this._uuid = appData.uuid;
        return appData;
      })
    );
  }

  /**
   * Merges given app data with this service's contained data.
   * @param appDataMerge The app data to merge with this service's contained data.
   * @return The merged app data.
   */
  private _mergeAppData(appDataMerge: Partial<AppData>): AppData {
    if (appDataMerge.pushRegistrationId) {
      this._pushRegistrationId = appDataMerge.pushRegistrationId;
    }
    return this.genAppData();
  }

  /**
   * Generates app data based on the data contained within this service.
   */
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

  /**
   * Deletes the app data record on the server.
   * @return An observable that resolves once the operation completes.
   */
  deleteAppData(): Observable<void> {
    const accountId: number = this.accountId;
    this._accountId = null;
    this._pushRegistrationId = null;
    return this._httpClient.delete(`${this.url}/${accountId}/${this.uuid}`, { withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errHandlerService.handleError(err))
    );
  }
}
