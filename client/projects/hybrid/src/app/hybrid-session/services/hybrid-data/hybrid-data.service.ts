import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '~hybrid-env/environment';
import { PushNotificationService } from '~hybrid/hybrid-plugins/services/push-notification/push-notification.service';
import { AppData, AppDataSaveRequest } from '~shared';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { SessionService } from '~web/session/services/session/session.service';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

/**
 * App data consists of mobile device/app information that is linked to a user's account/session.
 * This also includes vital information for setting up a link between accounts and push notification registration IDs.
 */
@Injectable({
  providedIn: 'root'
})
export class HybridDataService {

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
  private _accountId: number;

  constructor(
    private _authenticationService: AuthenticationService,
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
    private _pushNotificationService: PushNotificationService,
    private _sessionService: SessionService
  ) {}

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
    return this._pushNotificationService.pushRegistrationId;
  }

  /**
   * The ID of the user Account associated with the app data.
   */
  get accountId(): number {
    return this._accountId;
  }

  init(): void {
    this._initDeviceProperties();
    this._setupPushNotifications();
  }

  private _initDeviceProperties(): void {
    // Object.keys(device).forEach((deviceKey: string) => {
    //   this[`_${deviceKey}`] = device[deviceKey];
    // });
    this._isMobileApp = (this.platform && this.platform !== 'Browser');
  }

  private _setupPushNotifications(): void {
    // Only init push notifications if this is a mobile app.
    if (this.isMobileApp) {
      this._authenticationService.login$.subscribe(() => this._registerPushNotifications());
      this._authenticationService.logout$.subscribe(() => this._unregisterPushNotifications());
      if (this._sessionService.loggedIn) {
        this._registerPushNotifications();
      }
    }
  }

  private _registerPushNotifications(): void {
    this._pushNotificationService.register().subscribe(
      () => this.saveAppData()
    );
  }

  private _unregisterPushNotifications(): void {
    // this._pushNotificationService.unregister();
    this.deleteAppData();
  }

  /**
   * Saves app data on the server, and associates it with the user's account/session.
   * @return An observable that emits the saved app data.
   */
  saveAppData(): Observable<AppData> {
    const appData: AppData = this.genAppData();
    const saveReq: AppDataSaveRequest = { appData };
    return this._httpClient.post<AppData>(this.url, saveReq, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse<AppData>(),
      map((appData: AppData) => {
        this._accountId = appData.accountId;
        // Set this property since we may be in a browser, and the server may have had to generate UUID.
        this._uuid = appData.deviceUuid;
        return appData;
      })
    );
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
    return <Observable<void>>this._httpClient.delete(`${this.url}/${accountId}/${this.uuid}`, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse<void>()
    );
  }
}
