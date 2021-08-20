import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PermissionStatus, PushNotifications, Token } from '@capacitor/push-notifications';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  private _pushRegistrationId = '';
  private _pushRegistrationSubject = new Subject<string>();

  constructor() {}

  /**
   * true if the device is registered with the FCM server for push notifications, false if not.
   */
  get isRegistered(): boolean {
    return !!this._pushRegistrationId;
  }

  /**
   * The push notification registration ID. An empty string if not registered.
   */
  get pushRegistrationId(): string {
    return this._pushRegistrationId;
  }

  /**
   * Registers this device to receive push notifications.
   * @returns An observable that emits the push notification registration ID. An empty string if registration failed.
   */
  register(): Observable<string> {
    // Ensure only register once.
    if (this.isRegistered || !Capacitor.isNativePlatform()) {
      return of(this.pushRegistrationId);
    }

    // Setup listeners for push notification registration results.
    PushNotifications.addListener('registration', (token: Token) => this._setPushRegistrationId(token.value));
    PushNotifications.addListener('registrationError', (err: any) => {
      console.error(err);
      this._setPushRegistrationId('');
    });

    // Request permission to setup push notifications, and register.
    PushNotifications.requestPermissions()
      .then((status: PermissionStatus) => {
          if (status.receive === 'denied') {
            throw new Error('User declined receiving push notifications');
          }
      })
      .then(() => PushNotifications.register().then())
      .catch((err: Error) => {
        console.error(err);
        this._setPushRegistrationId('');
      });

    return this._pushRegistrationSubject.asObservable();
  }

  /**
   * Sets a given push notification registration ID, and emits its value.
   * @param id The push registration ID to set.
   */
  private _setPushRegistrationId(id: string) {
    this._pushRegistrationId = id;
    this._pushRegistrationSubject.next(this.pushRegistrationId);
    this._pushRegistrationSubject.complete();
  }

  // private _listenForNotifications(): void {
  //   this._pushNotificationClient.on('notification').subscribe((response: EventResponse) => {
  //     if (!response.additionalData.foreground && response.additionalData.notificationLink) {
  //       this._zone.run(() => this._router.navigate([response.additionalData.notificationLink]));
  //     }
  //   });
  // }
}
