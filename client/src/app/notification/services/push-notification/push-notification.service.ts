import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Push, PushObject, EventResponse } from '@ionic-native/push/ngx';
import { SessionService } from '../../../session/services/session/session.service';
import { AppDataService } from '../../../mobile/services/app-data/app-data.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  private _pushNotificationClient: PushObject;

  constructor(
    private _zone: NgZone,
    private _router: Router,
    private _sessionService: SessionService,
    private _appDataService: AppDataService,
    private _push: Push
  ) {}

  get isRegistered(): boolean {
    return (this._pushNotificationClient != null);
  }

  get pushRegistrationId(): string {
    return this._appDataService.pushRegistrationId;
  }

  init(): void {
    // Only init if this is a mobile app.
    if (this._appDataService.isMobileApp) {
      this._sessionService.login$.subscribe(this._register.bind(this));
      this._sessionService.logout$.subscribe(this._unregister.bind(this));
      if (this._sessionService.loggedIn) { this._register(); }
    }
  }

  private _register(): void {
    if (this.isRegistered) return;
    this._pushNotificationClient = this._push.init({
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
    });
    this._listenForRegistrationResponse();
    this._listenForNotifications();
    this._pushNotificationClient.on('error').subscribe(console.error);
  }

  private _listenForRegistrationResponse(): void {
    this._pushNotificationClient.on('registration').subscribe((response: EventResponse) =>
      this._appDataService.saveAppData({
        pushRegistrationId: response.registrationId
      }).subscribe()
    );
  }

  private _listenForNotifications(): void {
    this._pushNotificationClient.on('notification').subscribe((response: EventResponse) => {
      if (!response.additionalData.foreground && response.additionalData.notificationLink) {
        this._zone.run(() => this._router.navigate([response.additionalData.notificationLink]));
      }
    });
  }

  private _unregister(): void {
    if (this._pushNotificationClient) {
      this._pushNotificationClient.unregister()
        .catch(console.error);
      this._pushNotificationClient = null;
      this._appDataService.deleteAppData().subscribe();
    }
  }
}
