import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Push, PushObject, EventResponse, PushOptions } from '@ionic-native/push/ngx';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  private readonly _pushOpts: PushOptions = {
    android: {
      icon: 'notification',
      iconColor: '#3e2723'
    },
    browser: {
      pushServiceURL: 'http://push.api.phonegap.com/v1/push'
    },
    ios: {
      alert: "true",
      badge: true,
      sound: 'false'
    },
    windows: {}
  };

  private _pushNotificationClient: PushObject;
  private _pushRegistrationId: string;

  constructor(
    private _zone: NgZone,
    private _router: Router,
    private _push: Push
  ) {}

  get isRegistered(): boolean {
    return (this._pushNotificationClient != null);
  }

  get pushRegistrationId(): string {
    return this._pushRegistrationId;
  }

  register(): Observable<string> {
    if (this.isRegistered) return;
    this._pushNotificationClient = this._push.init(this._pushOpts);
    this._listenForNotifications();
    this._pushNotificationClient.on('error').subscribe(console.error);
    return this._pushNotificationClient.on('registration').pipe(
      map((response: EventResponse) => {
        this._pushRegistrationId = response.registrationId;
        return response.registrationId;
      })
    )
  }

  private _listenForNotifications(): void {
    this._pushNotificationClient.on('notification').subscribe((response: EventResponse) => {
      if (!response.additionalData.foreground && response.additionalData.notificationLink) {
        this._zone.run(() => this._router.navigate([response.additionalData.notificationLink]));
      }
    });
  }

  unregister(): void {
    if (this._pushNotificationClient) {
      this._pushNotificationClient.unregister()
        .catch(console.error);
      this._pushNotificationClient = null;
      this._pushRegistrationId = null;
    }
  }
}
