import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotifications } from '@capacitor/push-notifications';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  // private readonly _pushOpts: PushOptions = {
  //   android: {
  //     icon: 'notification',
  //     iconColor: '#3e2723'
  //   },
  //   browser: {
  //     pushServiceURL: 'http://push.api.phonegap.com/v1/push'
  //   },
  //   ios: {
  //     alert: "true",
  //     badge: true,
  //     sound: 'false'
  //   }
  // };

  private _pushRegistrationId: string;

  constructor(
    private _zone: NgZone,
    private _router: Router,
  ) {}

  // get isRegistered(): boolean {
  //   return (PushNotifications.regi != null);
  // }

  get pushRegistrationId(): string {
    return this._pushRegistrationId;
  }

  register(): Observable<void> {
    const registerPromise: Promise<void> = PushNotifications.register();
    // if (this.isRegistered) return of(this.pushRegistrationId);
    // this._pushNotificationClient = this._push.init(this._pushOpts);
    // this._listenForNotifications();
    // this._pushNotificationClient.on('error').subscribe(console.error);
    // return this._pushNotificationClient.on('registration').pipe(
    //   map((response: EventResponse) => {
    //     this._pushRegistrationId = response.registrationId;
    //     return response.registrationId;
    //   })
    // )
    return from(registerPromise);
  }

  // private _listenForNotifications(): void {
  //   this._pushNotificationClient.on('notification').subscribe((response: EventResponse) => {
  //     if (!response.additionalData.foreground && response.additionalData.notificationLink) {
  //       this._zone.run(() => this._router.navigate([response.additionalData.notificationLink]));
  //     }
  //   });
  // }

  // unregister(): void {
  //   if (this._pushNotificationClient) {
  //     this._pushNotificationClient.unregister()
  //       .catch(console.error);
  //     this._pushNotificationClient = null;
  //     this._pushRegistrationId = null;
  //   }
  // }
}
