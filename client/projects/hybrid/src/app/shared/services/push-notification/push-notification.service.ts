import { Injectable } from '@angular/core';
import { PushNotifications, PermissionStatus, Token } from '@capacitor/push-notifications';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  private _pushRegistrationId = '';

  constructor() {}

  get isRegistered(): boolean {
    return !!this._pushRegistrationId;
  }

  get pushRegistrationId(): string {
    return this._pushRegistrationId;
  }

  /**
   * Registers this device to receive push notifications.
   * @returns An observable that emits the push notification registration ID. An empty string if registration failed.
   */
  register(): Observable<string> {
    const registerSubject = new Subject<string>();

    // Ensure only register once.
    if (this.isRegistered) {
      return of(this.pushRegistrationId);
    }

    // Setup listeners for push notification registration results.
    PushNotifications.addListener('registration', (token: Token) => {
      this._pushRegistrationId = token.value;
      registerSubject.next(this._pushRegistrationId);
    });
    PushNotifications.addListener('registrationError', (err: Error) => {
      console.error(err);
      registerSubject.next('');
    });

    // Request permission to setup push notifications, and register.
    PushNotifications.requestPermissions()
      .then((status: PermissionStatus) => {
          if (status.receive === 'denied') {
            throw new Error('User declined receiving push notifications');
          }
      })
      .then(() => PushNotifications.register())
      .catch((err: Error) => {
        console.error(err);
        registerSubject.next('');
      });

    return registerSubject;
  }

  // private _listenForNotifications(): void {
  //   this._pushNotificationClient.on('notification').subscribe((response: EventResponse) => {
  //     if (!response.additionalData.foreground && response.additionalData.notificationLink) {
  //       this._zone.run(() => this._router.navigate([response.additionalData.notificationLink]));
  //     }
  //   });
  // }
}
