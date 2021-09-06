import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ActionPerformed, PermissionStatus, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { environment } from '~hybrid-env/environment';
import { AuthenticationService } from '~hybrid/session/services/authentication/authentication.service';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { MobileDeviceService } from '~hybrid/shared/services/mobile-device/mobile-device.service';
import { MobileDevice, PushRegistrationRequest } from '~shared';

/**
 * Initializes and maintains Android/iOS client push notification functionality.
 */
@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  readonly url = `${environment.server}/session/push-registration`;

  private _actions$ = new Subject<ActionPerformed>();
  private _notifications$ = new Subject<PushNotificationSchema>();
  private _registered$ = new ReplaySubject<string>(1);

  constructor(
    private _authenticationService: AuthenticationService,
    private _httpClient: HttpClient,
    private _mobileDeviceService: MobileDeviceService,
    private _ngZone: NgZone,
    private _router: Router,
    private _sessionService: SessionService,
  ) {}

  /**
   * An observable that emits each action performed on any push notification associated with this app.
   */
  get actions$(): Observable<ActionPerformed> {
    return this._actions$;
  }

  /**
   * An observable that emits each push notification that has been received.
   */
  get notifications$(): Observable<PushNotificationSchema> {
    return this._notifications$;
  }

  /**
   * true if the device is registered with the FCM server for push notifications, false if not.
   */
  get registered(): boolean {
    return !!this._mobileDeviceService.mobileDevice.pushRegistrationId;
  }

  /**
   * An observable that emits the push registration ID whenever the device newly registers for push notifications.
   * On first subscribe, will emit the latest registration ID if a registration has already occurred.
   */
  get registered$(): Observable<string> {
    return this._registered$.asObservable();
  }

  /**
   * The push notification registration ID. An empty string if not registered.
   */
  get pushRegistrationId(): string {
    return this._mobileDeviceService.mobileDevice.pushRegistrationId;
  }

  /**
   * Initializes push notifications for the mobile device.
   */
  init(): void {
    if (!this._mobileDeviceService.native) return; // Only initialize on native Android/iOS platforms.

    // Listen for login and network connection; attempt to (re)register device for push notifications when either is detected.
    this._authenticationService.login$.subscribe(() => this._register());
    this._mobileDeviceService.connected$.subscribe(() => this._register());

    // Setup listeners for push notification registration results.
    PushNotifications.addListener('registration', this._saveRegistration.bind(this));
    PushNotifications.addListener('registrationError', console.error);

    // Setup listeners for push notification receptions & actions.
    PushNotifications.addListener('pushNotificationReceived', this._notificationReceived.bind(this));
    PushNotifications.addListener('pushNotificationActionPerformed', this._actionPerformed.bind(this));
  }

  /**
   * Registers this device to receive push notifications.
   * @returns A promise that resolves once registration is complete.
   */
  private async _register(): Promise<void> {
    // Only attempt registration if the user is logged in and the device is connected to the network.
    if (!this._sessionService.loggedIn || !this._mobileDeviceService.connected) return;

    try {
      // Request permission to setup push notifications, and register.
      const status: PermissionStatus = await PushNotifications.requestPermissions();
      if (status.receive !== 'denied') {
        await PushNotifications.register();
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Saves the successful push registration (ID) on the server.
   * @param token The resulting token from the successful push notification registration.
   */
  private _saveRegistration(token: Token): void {
    this._ngZone.run(() => {
      this._mobileDeviceService.mobileDevice.pushRegistrationId = token.value;
      const request: PushRegistrationRequest = { pushRegistrationId: token.value };
      this._httpClient.put<MobileDevice>(this.url, request, { withCredentials: true }).subscribe(() =>
        () => this._registered$.next(this.pushRegistrationId)
      );
    });
  }

  /**
   * Handles all received push notifications.
   * @param notification The received push notification schema.
   */
  private _notificationReceived(notification: PushNotificationSchema): void {
    this._ngZone.run(() => this._notifications$.next(notification));
  }

  /**
   * Handles all performed push notification actions.
   * @param action The performed push notification action.
   */
  private _actionPerformed(action: ActionPerformed): void {
    this._ngZone.run(() => {
      if (action.actionId === 'tap') {
        const notificationLink: string = action.notification?.data?.notificationLink;
        if (notificationLink) {
          this._router.navigate([notificationLink]);
        }
      }
      this._actions$.next(action);
    });
  }
}
